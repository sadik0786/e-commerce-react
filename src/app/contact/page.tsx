"use client";

import { roboto } from "@/lib/fonts";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1
            className={`${roboto.className} text-4xl font-extrabold text-gray-900 sm:text-5xl`}
          >
            Get in Touch
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question about our investment algorithms or want to discuss a
            partnership? We would love to hear from you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          {/* Contact Information Sidebar */}
          <div className="bg-gray-900 text-white p-10 lg:w-1/3 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-gray-300 mb-8">
                Fill out the form and our Team will get back to you within 24
                hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-500 p-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">+91 8048131677</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-red-500 p-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">customercare@5nance.com</span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-red-500 p-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    B 603, Eureka Towers, Mind Space, Malad (West) Mumbai -
                    400064
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-sm text-gray-500">
                &copy; 2026 5nance Global Holdings.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 lg:w-2/3">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="First Name"
                    placeholder="John"
                    value=""
                    onChange={() => {}}
                  />
                </div>
                <div>
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value=""
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value=""
                  onChange={() => {}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => alert("Message Sent!")}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
