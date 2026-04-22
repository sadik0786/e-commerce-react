"use client";

import React, { useState } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean; // 👈 NEW
};

const Input = ({
  label,
  error,
  className = "",
  type = "text",
  showPasswordToggle = false,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseStyles =
    "w-full h-[42px] px-4 py-2 mt-1 border rounded-md outline-none pr-10 transition-all duration-200 focus:ring-1 focus:ring-red-500 focus:border-red-500";

  const errorStyles = error ? "border-red-500" : "border-gray-300";

  const inputType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="mb-2">
      {/* Label */}
      {label && <label className="text-sm font-normal">{label}</label>}

      {/* Input wrapper */}
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`${baseStyles} ${errorStyles} ${className}`}
        />

        {/* Eye Icon */}
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute outline-none right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
