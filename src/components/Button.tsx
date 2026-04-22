import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  loading,
  ...props
}: ButtonProps) => {
  const base =
    "outline-none px-4 py-2 rounded-md transition-colors duration-200 font-medium cursor-pointer";

  const variants = {
    primary: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-red-500 text-red-500 hover:bg-red-50",
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
