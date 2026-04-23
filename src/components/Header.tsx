"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import authService from "@/appwrite/auth";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/index";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  
  // Use the global Auth state instead of fetching every time
  const { user, isAdmin, loading, refreshAuth } = useAuth();

  // Dynamically calculate what menus to show
  let navLinks: { name: string; path: string }[] = [];

  if (!loading) {
    if (isAdmin) {
      navLinks = [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Add Product", path: "/admin/addProduct" },
        { name: "List Product", path: "/admin/listProduct" },
        { name: "Order List", path: "/admin/orderList" },
        { name: "User List", path: "/admin/userList" },
        { name: "User Message", path: "/admin/userMessage" },
      ];
    } else if (user) {
      navLinks = [
        { name: "Home", path: "/" },
        { name: "Product", path: "/product" }, 
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "Profile", path: "/profile" },
      ];
    } else {
      navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ];
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      showToast("Logged out successfully", "success");
      await refreshAuth(); // Update global auth state
      router.push("/");
    } catch (e) {
      console.error("Failed to logout", e);
      showToast("Logout failed", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white border-b-2 border-red-500">
      <div className=" mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="w-120">
          <Link href="/" className="text-xl font-bold whitespace-nowrap block">
            <Image
              src="/images/5nance-logo-white.png"
              alt="logo"
              width={160}
              height={80}
              style={{ width: "auto", height: "auto" }}
              loading="eager"
              priority
            />
          </Link>
        </div>

        {/* Right Side (Menu + Login) */}
        <div className="flex items-center gap-6">
          {/* Menu */}
          <nav className="flex gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`px-4 py-1 rounded-sm transition-colors duration-200 ${
                    isActive
                      ? "text-red-600 bg-red-100"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {loading && <span className="px-4 py-1 animate-pulse text-gray-500">...</span>}
          </nav>

          {/* Login Button or User Profile */}
          {!loading && user ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-200">
                Hi, {user.name || user.email.split("@")[0]}
                {isAdmin && <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded">Admin</span>}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-10"
              >
                Logout
              </Button>
            </div>
          ) : !loading && !user ? (
            <Link
              href="/login"
              className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
            >
              Login
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
