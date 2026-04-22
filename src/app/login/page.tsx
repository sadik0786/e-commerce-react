"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import authService from "@/appwrite/auth";
import configService from "@/appwrite/config";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { refreshAuth } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Switch between Login and Sign Up
  const toggleForm = () => {
    setIsRegister(!isRegister);
    // Clear all fields and errors on toggle
    setName("");
    setEmail("");
    setPassword("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
  };

  const onSubmit = async () => {
    let isValid = true;
    
    // Validate Name (only if registering)
    if (isRegister && name.trim() === "") {
        setNameError("Name is required");
        isValid = false;
    } else {
        setNameError("");
    }

    // Validate Email
    if (email.trim() === "") {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Validate Password
    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Stop execution if there are errors
    if (!isValid) return;

    setIsLoading(true);
    
    // Helper to check if user is admin
    const checkAdminAndRedirect = async () => {
      try {
        const userTeams = await authService.listTeams();
        // Check if the user specifically has a team named "Admins" OR "admins"
        const isAdmin = userTeams.teams.some(team => team.name.toLowerCase() === "admins");
        
        // Refresh global state after determining role
        await refreshAuth();
        
        if (isAdmin) {
            router.push("/admin/dashboard");
        } else {
            router.push("/");
        }
      } catch (err) {
        // If teams fail to load somehow, default to home
        router.push("/");
      }
    };

    if (isRegister) {
      try {
        await authService.createAccount({ email, password, name });
        showToast("Account Created Successfully! You can now login.", "success");
        toggleForm(); // switch to login form automatically after registering
      } catch (e) {
        showToast((e as Error).message, "error");
      }
    } else {
      try {
        await authService.login({ email, password });
        showToast("Welcome Back! Login Successful.", "success");
        await checkAdminAndRedirect();
      } catch (e) {
        const errorMsg = (e as Error).message;
        
        // If they already have an active session, just let them through!
        if (errorMsg.includes("session is active") || errorMsg.includes("Creation of a session is prohibited")) {
            showToast("Session already active. Redirecting...", "info");
            await checkAdminAndRedirect();
        } else {
            showToast(errorMsg, "error");
        }
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 rounded-md bg-white p-8 space-y-4 shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isRegister ? "Create an Account" : "Welcome Back"}
      </h2>
      
      {/* Show Name input only if in Register mode */}
      {isRegister && (
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
        />
      )}
      
      <Input
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
      />
      
      <Input
        label="Password"
        placeholder="Enter password"
        type="password"
        value={email ? password : password} // hack to avoid unused warning if omitted
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
        showPasswordToggle
      />
      
      <div className="pt-4">
        <Button variant="primary" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
        </Button>
      </div>

      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button"
            onClick={toggleForm} 
            className="text-red-500 hover:text-red-600 font-semibold transition-colors bg-transparent border-none cursor-pointer"
          >
            {isRegister ? "Login here" : "Sign up here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
