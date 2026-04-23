"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import authService from "@/appwrite/auth";
import { useToast } from "@/context/ToastContext";

export default function UserProfile() {
  const { user, loading, refreshAuth } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

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

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Cover Photo / Header Gradient */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-gradient-to-r from-red-600 to-orange-500 blur-[100px] rounded-full transform rotate-12 mix-blend-screen"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-gradient-to-l from-violet-600 to-fuchsia-600 blur-[100px] rounded-full transform -rotate-12 mix-blend-screen"></div>
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        
        {/* Logout button top right */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-white/10 hover:bg-red-500 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 shadow-xl"
          >
            <span>Logout</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 md:-mt-32 z-10">
        
        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center text-center">
          
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-2xl -mt-20 md:-mt-28 mb-6 relative group">
             <div className="w-full h-full rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center text-5xl md:text-6xl font-black text-white relative overflow-hidden">
                <span className="relative z-10">{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             </div>
             {/* Edit Icon */}
             <div className="absolute bottom-2 right-2 bg-white text-gray-900 p-2.5 rounded-full shadow-lg border border-gray-100 cursor-pointer hover:scale-110 transition-transform">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </div>
          </div>

          {/* User Info */}
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
             {user.name || "Valued Customer"}
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm font-medium border border-gray-200">
             <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             {user.email}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
           
           {/* Left Column: Metrics / Quick Actions */}
           <div className="lg:col-span-2 space-y-6 md:space-y-8">
              
              <h2 className="text-2xl font-black text-gray-900 px-2 tracking-tight">Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                 {/* Wishlist Premium Card */}
                 <Link href="/wishlist" className="group relative bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2 block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-100 transition-colors duration-500 z-0"></div>
                    <div className="relative z-10 flex flex-col items-start h-full">
                       <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm">
                         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 mb-2">My Wishlist</h3>
                       <p className="text-gray-500 font-medium mb-8">View and manage your saved favorite items</p>
                       <div className="mt-auto flex items-center text-red-600 font-bold group-hover:text-red-700 transition-colors">
                          Check Wishlist 
                          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                       </div>
                    </div>
                 </Link>

                 {/* Cart Premium Card */}
                 <Link href="/cart" className="group relative bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2 block">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-100 transition-colors duration-500 z-0"></div>
                    <div className="relative z-10 flex flex-col items-start h-full">
                       <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-sm">
                         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 mb-2">My Cart</h3>
                       <p className="text-gray-500 font-medium mb-8">Checkout the items you have ready to purchase</p>
                       <div className="mt-auto flex items-center text-orange-600 font-bold group-hover:text-orange-700 transition-colors">
                          View Cart 
                          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                       </div>
                    </div>
                 </Link>
              </div>

           </div>

           {/* Right Column: Settings & More */}
           <div className="space-y-6 md:space-y-8">
              <h2 className="text-2xl font-black text-gray-900 px-2 tracking-tight">Account</h2>
              
              <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-4 md:p-6">
                 <ul className="space-y-2">
                    {[
                      { title: "Orders & Returns", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", color: "text-blue-500", bg: "bg-blue-50" },
                      { title: "Payment Methods", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", color: "text-emerald-500", bg: "bg-emerald-50" },
                      { title: "Shipping Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", color: "text-purple-500", bg: "bg-purple-50" },
                      { title: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", color: "text-gray-600", bg: "bg-gray-100" }
                    ].map((item, idx) => (
                      <li key={idx}>
                         <Link href="#" className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                               </div>
                               <span className="font-bold text-gray-800">{item.title}</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                         </Link>
                      </li>
                    ))}
                 </ul>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
