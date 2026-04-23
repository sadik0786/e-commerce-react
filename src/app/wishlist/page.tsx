"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import configService from "@/appwrite/config";
import rootConfig from "@/lib/rootConfig";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface WishlistItem {
  $id: string;
  productId: string;
  userId: string;
  productDetails?: any;
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchWishlistItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await configService.getWishlist({ userId: user.$id });
      const items = response.documents as unknown as WishlistItem[];
      
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          try {
            const product = await configService.getProduct({ id: item.productId });
            return { ...item, productDetails: product };
          } catch (error) {
            console.error("Error fetching product details", error);
            return item;
          }
        })
      );
      
      setWishlistItems(itemsWithDetails);
    } catch (error) {
      console.error("Error fetching wishlist", error);
      showToast("Failed to load wishlist", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchWishlistItems();
    }
  }, [user, authLoading]);

  const handleRemove = async (id: string) => {
    try {
      await configService.removeFromWishlist({ id });
      setWishlistItems((prev) => prev.filter((item) => item.$id !== id));
      showToast("Removed from your selection", "info");
    } catch (error) {
      showToast("Failed to remove item", "error");
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (!user) return;
    try {
      await configService.addToCart({
        productId: item.productId,
        userId: user.$id,
        quantity: "1",
        price: item.productDetails.price.toString(),
      });
      showToast("Added to collection", "success");
    } catch (error) {
      showToast("Failed to add to collection", "error");
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

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 px-4 md:py-32 selection:bg-red-100 selection:text-red-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-9xl font-black text-black tracking-tighter leading-[0.8] mb-8">
              CURATED <span className="text-red-600 italic">WISHLIST</span>
            </h1>
            <p className="text-2xl text-gray-400 font-medium italic max-w-xl">
              Your personal gallery of exceptional pieces. Reserved for your eventual acquisition.
            </p>
          </div>
          <Link
            href="/product"
            className="group flex flex-col items-end gap-2"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 group-hover:text-black transition-colors">Continue Browsing</span>
            <div className="w-16 h-1 bg-gray-100 group-hover:w-32 group-hover:bg-red-600 transition-all duration-500 rounded-full"></div>
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-gray-50 rounded-[4rem] p-32 text-center border border-gray-100 shadow-inner flex flex-col items-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-10 shadow-xl shadow-gray-200/50">
              <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h2 className="text-4xl font-black text-black mb-6 tracking-tight">GALLERY IS EMPTY</h2>
            <p className="text-gray-400 mb-16 max-w-md mx-auto text-xl font-medium leading-relaxed">
              Discover pieces that resonate with your style and save them for your next statement.
            </p>
            <Link
              href="/product"
              className="bg-black text-white px-16 py-6 rounded-full font-black text-xl hover:bg-red-600 transition-all duration-500 active:scale-95 shadow-2xl shadow-black/10"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
            {wishlistItems.map((item) => (
              <div
                key={item.$id}
                className="group flex flex-col"
              >
                {/* Visual Frame */}
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 shadow-lg shadow-gray-200/50 group-hover:shadow-2xl transition-all duration-[1s] mb-8">
                  <Image
                    src={getImageUrl(item.productDetails?.productImage)}
                    alt={item.productDetails?.title || "Product"}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                  />
                  
                  {/* Glass Action Overlay */}
                  <div className="absolute inset-x-4 bottom-4 flex gap-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                     <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-white/40 backdrop-blur-2xl border border-white/50 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl"
                     >
                        Transfer to Bag
                     </button>
                     <button
                        onClick={() => handleRemove(item.$id)}
                        className="w-14 h-14 bg-red-600/20 backdrop-blur-2xl border border-red-500/30 text-red-600 flex items-center justify-center rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"
                        title="Remove Selection"
                     >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                     </button>
                  </div>
                </div>
                
                {/* Content Narrative */}
                <div className="px-4 space-y-2">
                  <div className="flex justify-between items-start">
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 block mb-1">{item.productDetails?.category || "COLLECTION"}</span>
                        <h3 className="text-2xl font-black text-black tracking-tighter leading-none group-hover:text-red-600 transition-colors">
                          {item.productDetails?.title || "Loading..."}
                        </h3>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                     <span className="text-3xl font-black text-black tracking-tighter">
                       ₹{item.productDetails?.price?.toLocaleString('en-IN')}
                     </span>
                     <span className="text-sm text-gray-300 font-bold line-through">₹{(item.productDetails?.price * 1.2).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <div className="max-w-7xl mx-auto px-4 mt-64 border-t border-gray-100 py-20 text-center">
         <span className="text-9xl font-black text-gray-50 tracking-tighter select-none">PREMIUM COLLECTIONS</span>
      </div>
    </div>
  );
}
