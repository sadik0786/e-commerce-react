"use client";

import { useEffect, useState } from "react";
import { roboto } from "@/lib/fonts";
import configService from "@/appwrite/config";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function UserMessagesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await configService.getUserMessages();
        setMessages(response.documents);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        showToast("Failed to load messages", "error");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAdmin) {
      fetchMessages();
    }
  }, [isAdmin, authLoading]);

  if (authLoading || loading) {
    return <div className="p-10 text-center animate-pulse">Loading Messages...</div>;
  }

  if (!isAdmin) {
    return <div className="p-10 text-center text-red-600 font-bold">Access Denied</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className={`${roboto.className} text-3xl font-black text-gray-900`}>
            Inquiry <span className="text-red-600">Messages</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage and respond to user inquiries.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-600">
           Total: {messages.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900 text-white text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Contact Info</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                     No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.$id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base">{msg.u_name}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                           {msg.u_address || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-600">
                           <span className="w-4">📧</span> {msg.u_email}
                        </div>
                        <div className="flex items-center text-gray-600">
                           <span className="w-4">📞</span> {msg.u_mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(msg.$createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedMessage(msg)}
                        className="bg-gray-100 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 font-bold text-xs"
                      >
                        View Message
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all scale-100">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Message Details</h3>
              <button onClick={() => setSelectedMessage(null)} className="hover:text-red-500 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                 <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl">
                    {selectedMessage.u_name.charAt(0)}
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900">{selectedMessage.u_name}</h4>
                    <p className="text-xs text-gray-500">{selectedMessage.u_email}</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Message</span>
                  <div className="mt-2 bg-gray-50 p-4 rounded-2xl text-gray-700 leading-relaxed italic">
                    "{selectedMessage.u_message}"
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Mobile</span>
                    <p className="text-sm font-bold text-gray-900">{selectedMessage.u_mobile}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Date</span>
                    <p className="text-sm font-bold text-gray-900">
                       {new Date(selectedMessage.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                 <a 
                   href={`mailto:${selectedMessage.u_email}`}
                   className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-100"
                 >
                    Reply via Email
                 </a>
                 <button 
                   onClick={() => setSelectedMessage(null)}
                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-2xl font-bold transition-all"
                 >
                    Close
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
