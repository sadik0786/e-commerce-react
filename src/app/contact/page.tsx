"use client";

import { useState } from "react";
import { roboto } from "@/lib/fonts";
import { Button, Input } from "@/components/index";
import { useToast } from "@/context/ToastContext";
import configService from "@/appwrite/config";

export default function Contact() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map frontend fields to Appwrite fields
      await configService.saveUserMessage({
        u_name: formData.fullName,
        u_mobile: parseInt(formData.mobile.replace(/\D/g, '')), // Convert to Number
        u_email: formData.email,
        u_address: formData.address,
        u_message: formData.message,
      });

      showToast("Thank you! Your message has been sent.", "success");
      
      // Clear form
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        address: "",
        message: "",
      });
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Failed to send message. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`${roboto.className} text-4xl font-extrabold text-gray-900 sm:text-5xl`}>
            Get in <span className="text-red-600">Touch</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-lg mx-auto">
            Have a question or want to discuss a partnership? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          {/* Contact Information Sidebar */}
          <div className="bg-gray-900 text-white p-10 lg:w-1/3 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Info</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Fill out the form and our Team will get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-center space-x-4 group">
                  <div className="bg-red-500/10 p-3 rounded-2xl group-hover:bg-red-500 transition-colors duration-300">
                    <svg className="w-5 h-5 text-red-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 font-medium">+91 8048131677</span>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="bg-red-500/10 p-3 rounded-2xl group-hover:bg-red-500 transition-colors duration-300">
                    <svg className="w-5 h-5 text-red-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 font-medium truncate">customercare@5nance.com</span>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="bg-red-500/10 p-3 rounded-2xl group-hover:bg-red-500 transition-colors duration-300">
                    <svg className="w-5 h-5 text-red-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm leading-snug">
                    B 603, Eureka Towers, Mind Space, Malad (West) Mumbai - 400064
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-xs text-gray-500 tracking-widest uppercase font-bold">
                &copy; 2026 5nance Global Holdings
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
                <Input
                  label="Mobile Number"
                  placeholder="+91 00000 00000"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Input
                  label="Address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={2}
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="px-10"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
