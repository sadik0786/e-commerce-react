"use client";

import { useEffect, useState } from "react";
import configService from "@/appwrite/config";
import rootConfig from "@/lib/rootConfig";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import Image from "next/image";
import { Models } from "appwrite";

interface ProductDoc extends Models.Document {
  title: string;
  price: number;
  productImage: string;
  category: string;
  status: boolean;
  stock: number;
}

export default function ListProductPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await configService.getProducts();
      setProducts(data.documents as unknown as ProductDoc[]);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, productImage: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      
      // 1. Delete from Database
      await configService.deleteProduct({ id });
      
      // 2. Delete from Storage if it's an Appwrite ID
      if (productImage && !productImage.startsWith('http')) {
         await configService.deleteFile(productImage);
      }

      showToast("Product deleted successfully", "success");
      setProducts(products.filter(p => p.$id !== id));
    } catch (error) {
      showToast("Failed to delete product", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (image: string) => {
    if (!image || image === "undefined") return "https://fakeimg.pl/200x200/f3f4f6/9ca3af?text=No+Img";
    if (typeof image === 'string' && image.startsWith("http")) return image;
    const project = rootConfig.appWriteProjectId;
    const bucket = rootConfig.appWriteBucketId;
    if (!project || project === "undefined" || !bucket || bucket === "undefined") return "https://fakeimg.pl/200x200/f3f4f6/9ca3af?text=Missing+ID";
    return `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucket}/files/${image}/view?project=${project}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-12">
        <div>
           <span className="text-xs font-black uppercase tracking-[0.3em] text-red-600 mb-4 inline-block">Management Portal</span>
           <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter">STORE <span className="italic">INVENTORY</span></h1>
        </div>
        <Link 
          href="/admin/addProduct"
          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-black/10"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
           Add New Item
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
             <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">No products found in inventory</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Article</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pricing</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.$id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-20 rounded-2xl bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-50">
                             <Image 
                               src={getImageUrl(product.productImage)} 
                               alt={product.title} 
                               fill 
                               unoptimized 
                               className="object-cover"
                             />
                          </div>
                          <div>
                            <h4 className="font-black text-black tracking-tight text-lg">{product.title}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">ID: {product.$id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1 bg-gray-100 text-black text-[9px] font-black uppercase tracking-widest rounded-full group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-200">
                          {product.category || "Exclusive"}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-black text-lg tracking-tighter">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-bold text-black">{product.stock} units</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.status ? 'text-green-600' : 'text-gray-300'}`}>
                          {product.status ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin/editProduct/${product.$id}`}
                            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all"
                          >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.$id, product.productImage)}
                            disabled={deletingId === product.$id}
                            className="w-10 h-10 bg-white border border-red-100 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                          >
                             {deletingId === product.$id ? (
                               <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                             ) : (
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                             )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}