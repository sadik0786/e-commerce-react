"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import authService from "@/appwrite/auth";
import configService from "@/appwrite/config";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isAdmin, loading, refreshAuth } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      if (user) {
        try {
          const [cart, wish] = await Promise.all([
            configService.getCart({ userId: user.$id }),
            configService.getWishlist({ userId: user.$id })
          ]);
          setCartCount(cart.total);
          setWishlistCount(wish.total);
        } catch (error) {
          console.error("Error fetching header counts", error);
        }
      }
    };
    if (!loading) fetchCounts();
  }, [user, loading, pathname]); // Re-fetch on path change to update counts

  const handleLogout = async () => {
    try {
      await authService.logout();
      showToast("Logged out successfully", "success");
      await refreshAuth();
      router.push("/");
    } catch (e) {
      showToast("Logout failed", "error");
    }
  };

  const navLinks = isAdmin 
    ? [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Add Product", path: "/admin/addProduct" },
        { name: "List Product", path: "/admin/listProduct" },
        { name: "Orders", path: "/admin/orderList" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Collections", path: "/product" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
      ];

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? "py-4 bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]" 
          : "py-6 bg-white border-b border-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="relative z-10 flex items-center group">
           <div className="w-10 h-10 bg-black rounded-xl rotate-3 group-hover:rotate-12 transition-transform duration-500 flex items-center justify-center overflow-hidden">
              <span className="text-white font-black text-xl italic">A</span>
           </div>
           <span className="ml-3 text-2xl font-black tracking-tighter text-black">ANTIGRAVITY<span className="text-red-600 italic">.</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group ${
                pathname === link.path ? "text-red-600" : "text-gray-400 hover:text-black"
              }`}
            >
              {link.name}
              <div className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all duration-300 ${
                pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
              }`}></div>
            </Link>
          ))}
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-6">
          
          {!loading && user && !isAdmin && (
            <div className="hidden md:flex items-center gap-4">
               {/* Wishlist Icon */}
               <Link href="/wishlist" className="relative p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-[10px] font-black text-white rounded-full flex items-center justify-center ring-2 ring-white">
                       {wishlistCount}
                    </span>
                  )}
               </Link>

               {/* Cart Icon */}
               <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-black text-[10px] font-black text-white rounded-full flex items-center justify-center ring-2 ring-white">
                       {cartCount}
                    </span>
                  )}
               </Link>
            </div>
          )}

          {/* User / Login Button */}
          {!loading ? (
            user ? (
               <div className="flex items-center gap-4">
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-3 pl-4 border-l border-gray-100 group"
                  >
                     <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-gray-300 group-hover:text-red-600 transition-colors">Account</p>
                        <p className="text-xs font-black text-black tracking-tight line-clamp-1">{user.name}</p>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-black font-black text-xs hover:border-red-200 hover:bg-red-50 transition-all">
                        {user.name.charAt(0).toUpperCase()}
                     </div>
                  </Link>
                  {/* <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button> */}
               </div>
            ) : (
               <Link 
                 href="/login" 
                 className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-black/10 active:scale-95"
               >
                 Sign In
               </Link>
            )
          ) : (
            <div className="w-32 h-10 bg-gray-50 rounded-full animate-pulse"></div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-black"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-50 transition-all duration-500 overflow-hidden ${
        isMobileMenuOpen ? "max-h-[80vh] py-10 shadow-2xl" : "max-h-0"
      }`}>
        <nav className="flex flex-col items-center gap-8 px-4 text-center">
           {navLinks.map((link) => (
             <Link 
               key={link.name} 
               href={link.path} 
               onClick={() => setIsMobileMenuOpen(false)}
               className="text-2xl font-black uppercase tracking-tighter text-black hover:text-red-600 transition-colors"
             >
               {link.name}
             </Link>
           ))}
           {!user && (
             <Link 
               href="/login" 
               onClick={() => setIsMobileMenuOpen(false)}
               className="w-full bg-black text-white py-5 rounded-3xl font-black text-xl uppercase tracking-widest shadow-xl"
             >
               Sign In
             </Link>
           )}
           <div className="flex gap-8 pt-8 border-t border-gray-100 w-full justify-center">
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-red-600 flex flex-col items-center gap-2">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                 <span className="text-[10px] font-black uppercase tracking-widest">Saved</span>
              </Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-black flex flex-col items-center gap-2">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                 <span className="text-[10px] font-black uppercase tracking-widest">Bag</span>
              </Link>
           </div>
        </nav>
      </div>
    </header>
  );
}
