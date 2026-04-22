"use client";

import { useEffect, useState } from "react";
import configService from "@/appwrite/config";
import { roboto } from "@/lib/fonts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    outOfStock: 0,
    categories: 0
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await configService.getProducts();
        const docs = response.documents;
        
        const totalStock = docs.reduce((acc, curr) => acc + (curr.stock || 0), 0);
        const lowStock = docs.filter(doc => (doc.stock || 0) < 10).length;
        const uniqueCats = new Set(docs.map(doc => doc.category)).size;

        setStats({
          totalProducts: docs.length,
          totalStock,
          outOfStock: lowStock,
          categories: uniqueCats
        });

        setRecentProducts(docs.slice(0, 5));
      } catch (error) {
        console.error("Dashboard data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    { 
      label: "Total Products", 
      value: stats.totalProducts, 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>, 
      color: "bg-blue-500" 
    },
    { 
      label: "Total Inventory", 
      value: stats.totalStock, 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>, 
      color: "bg-green-500" 
    },
    { 
      label: "Low Stock Items", 
      value: stats.outOfStock, 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>, 
      color: "bg-red-500" 
    },
    { 
      label: "Active Categories", 
      value: stats.categories, 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>, 
      color: "bg-purple-500" 
    },
  ];

  if (loading) return <div className="p-10 animate-pulse text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`${roboto.className} text-3xl font-bold text-gray-900`}>Store Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening in your shop today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metricCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`${card.color} p-4 rounded-xl text-white text-2xl mr-4 shadow-lg shadow-gray-200`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Recently Added Products</h2>
            <button className="text-sm text-red-500 font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-gray-400 bg-gray-50">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProducts.map((p) => (
                  <tr key={p.$id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      <img src={p.productImage} className="w-10 h-10 rounded-lg object-cover mr-3 bg-gray-100" alt="" />
                      <span className="font-medium text-gray-900 text-sm line-clamp-1">{p.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{p.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">${p.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock} Units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Analytics Placeholder / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <h3 className="text-xl font-bold mb-2">Revenue Growth</h3>
            <p className="text-gray-400 text-sm mb-4">You have +12.5% increase from last month.</p>
            <div className="h-24 flex items-end gap-2 px-2">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4">Stock Status</h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-xs mb-1">
                      <span>Inventory Utilization</span>
                      <span>85%</span>
                   </div>
                   <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[85%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs mb-1">
                      <span>Warehouse Capacity</span>
                      <span>42%</span>
                   </div>
                   <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[42%]"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
