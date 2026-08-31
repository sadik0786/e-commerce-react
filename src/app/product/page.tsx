"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Models } from "appwrite";
import { useToast } from "@/context/ToastContext";
import authService from "@/appwrite/auth";
import configService from "@/appwrite/config";
import rootConfig from "@/lib/rootConfig";
import Image from "next/image";

interface ProductDoc extends Models.Document {
  title: string;
  description: string;
  price: number;
  productImage: string;
  slug: string;
  status: boolean;
  stock: number;
  category: string;
}

export default function ProductPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const currentUser = await authService.getCurrentUser().catch(() => null);
        setUser(currentUser);

        const response = await configService.getProducts();
        const activeProducts = response.documents.filter((p: any) => p.status === true);
        setProducts(activeProducts as unknown as ProductDoc[]);
        
        // Load user wishlist state
        if (currentUser) {
          const wishResponse = await configService.getWishlist({ userId: currentUser.$id });
          const wishMap: Record<string, boolean> = {};
          wishResponse.documents.forEach((doc: any) => {
            wishMap[doc.productId] = true;
          });
          setWishlist(wishMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleWishlist = async (productId: string) => {
    if (!user) return showToast("Please login to use wishlist", "error");

    try {
      if (wishlist[productId]) {
        // Find the document ID to remove (ideally wishlist should be fetched more robustly)
        const wishResponse = await configService.getWishlist({ userId: user.$id });
        const docToDelete = wishResponse.documents.find((d: any) => d.productId === productId);
        if (docToDelete) {
          await configService.removeFromWishlist({ id: docToDelete.$id });
          setWishlist(prev => ({ ...prev, [productId]: false }));
          showToast("Removed from Selection", "info");
        }
      } else {
        await configService.addToWishlist({ productId, userId: user.$id });
        setWishlist(prev => ({ ...prev, [productId]: true }));
        showToast("Added to Selection!", "success");
      }
    } catch (error: any) {
      console.error(error);
      showToast("Error updating selection", "error");
    }
  };

  const handleAddToCart = async (product: ProductDoc) => {
    if (!user) return showToast("Please login to add items to cart", "error");

    try {
      await configService.addToCart({
        productId: product.$id,
        userId: user.$id,
        quantity: "1", 
        price: product.price.toString(),
      });
      showToast(`${product.title} added to Bag!`, "success");
    } catch (error: any) {
      console.error(error);
      showToast("Failed to add to Bag", "error");
    }
  };

  const getImageUrl = (image: string) => {
    if (!image || image === "undefined") return "https://fakeimg.pl/800x1200/f3f4f6/9ca3af?text=No+Image";
    if (typeof image === 'string' && image.startsWith("http")) return image;
    
    const project = rootConfig.appWriteProjectId;
    const bucket = rootConfig.appWriteBucketId;
    
    if (!project || project === "undefined" || !bucket || bucket === "undefined") {
      return `https://fakeimg.pl/800x1200/f3f4f6/9ca3af?text=Missing+ID`;
    }

    return `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucket}/files/${image}/view?project=${project}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white pb-32">
      
      {/* Cinematic Hero Header */}
      <div className="relative pt-6 pb-24 md:pt-10 md:pb-40 px-4 overflow-hidden">
         {/* Background Aurora Effect */}
         <div className="absolute top-0 left-0 w-full h-full -z-10">
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-red-50/50 blur-[150px] rounded-full transform translate-x-[20%] -translate-y-[20%]"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-gray-50 blur-[120px] rounded-full transform -translate-x-[10%] translate-y-[10%]"></div>
         </div>

         <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="max-w-3xl">
               <span className="inline-block text-xs font-black uppercase tracking-[0.4em] text-red-600 mb-6">Established MMXXIV</span>
               <h1 className="text-7xl md:text-[10rem] font-black text-black leading-[0.8] tracking-tighter mb-10">
                  MODERN <br />
                  <span className="italic">ESSENTIALS</span>
               </h1>
               <p className="text-xl md:text-2xl text-gray-400 font-medium italic max-w-xl leading-relaxed">
                  A meticulously curated collection of high-performance pieces designed for the contemporary lifestyle.
               </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-8">
               {/* Premium Search */}
               <div className="relative w-full max-w-sm group">
                  <input 
                    type="text" 
                    placeholder="FIND YOUR PIECE" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-b-2 border-gray-100 py-4 px-2 font-black text-xs uppercase tracking-[0.3em] focus:outline-none focus:border-black transition-all placeholder:text-gray-200"
                  />
                  <svg className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </div>
               
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                  <span>DISCOVERING</span>
                  <div className="h-px w-12 bg-gray-100"></div>
                  <span className="text-black">{filteredProducts.length} ARTICLES</span>
               </div>
            </div>
         </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {filteredProducts.length === 0 ? (
          <div className="py-40 text-center flex flex-col items-center border-t border-gray-100">
             <div className="text-9xl mb-12 opacity-10 grayscale">🔍</div>
             <h2 className="text-4xl font-black text-black tracking-tight mb-4">NOTHING FOUND</h2>
             <p className="text-gray-400 font-medium italic text-lg">Your search yielded no results in our current curation.</p>
             <button onClick={() => setSearchQuery("")} className="mt-10 text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-red-600 hover:border-red-600 transition-all">Clear Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24">
            {filteredProducts.map((product) => {
              const isWished = wishlist[product.$id];

              return (
                <div 
                  key={product.$id} 
                  className="group flex flex-col"
                >
                  {/* Visual Frame */}
                  <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-lg shadow-gray-200/50 group-hover:shadow-2xl transition-all duration-[1s] mb-10">
                     <Link href={`/product/${product.$id}`} className="block w-full h-full">
                        <Image 
                          src={getImageUrl(product.productImage)} 
                          alt={product.title}
                          fill
                          unoptimized={true}
                          className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                        />
                     </Link>
                     
                     {/* Action Badges */}
                     <div className="absolute top-6 left-6 z-10">
                        <span className="bg-white/40 backdrop-blur-xl border border-white/40 text-black text-[9px] font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-[0.2em]">
                          {product.category || "Exclusive"}
                        </span>
                     </div>

                     <button 
                        onClick={() => handleWishlist(product.$id)}
                        className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/40 backdrop-blur-xl border border-white/40 rounded-full shadow-lg flex items-center justify-center transition-all hover:bg-white active:scale-90 group/wish"
                     >
                        <svg 
                          fill={isWished ? "#ef4444" : "none"} 
                          viewBox="0 0 24 24" 
                          strokeWidth={2.5} 
                          stroke={isWished ? "#ef4444" : "#000"} 
                          className="w-5 h-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                     </button>

                     {/* Quick View Overlay */}
                     <Link href={`/product/${product.$id}`} className="absolute inset-x-6 bottom-6 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 z-20">
                        <div className="bg-black text-white text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-600 transition-colors shadow-2xl shadow-black/20">
                           Review Details
                        </div>
                     </Link>
                  </div>

                  {/* Narrative Info */}
                  <div className="px-2 space-y-4">
                     <div className="flex justify-between items-start gap-4">
                        <Link href={`/product/${product.$id}`} className="flex-1">
                           <h3 className="text-2xl font-black text-black tracking-tighter leading-none group-hover:text-red-600 transition-colors duration-500">
                               {product.title}
                           </h3>
                        </Link>
                        <span className="text-lg font-black text-black tracking-tighter">
                           ₹{product.price.toLocaleString('en-IN')}
                        </span>
                     </div>
                     
                     <p className="text-gray-400 text-sm font-medium line-clamp-1 italic">
                       {product.description}
                     </p>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex gap-1">
                           {[1,2,3,4,5].map(star => <div key={star} className="w-1.5 h-1.5 bg-gray-100 rounded-full"></div>)}
                        </div>
                        <button 
                           onClick={() => handleAddToCart(product)}
                           className="text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                           <span>Add to Bag</span>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        </button>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decorative Brand Banner */}
      <div className="mt-64 py-32 bg-black text-white overflow-hidden flex whitespace-nowrap opacity-10 select-none">
         <div className="text-[15rem] font-black tracking-tighter animate-scroll px-10">MODERN ESSENTIALS • PREMIUM CURATION • TIMELESS DESIGN • </div>
         <div className="text-[15rem] font-black tracking-tighter animate-scroll px-10">MODERN ESSENTIALS • PREMIUM CURATION • TIMELESS DESIGN • </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
