"use client";

import { useEffect, useState } from "react";
import { Models } from "appwrite";
import { Button, Toast } from "@/components/index";
import { roboto } from "@/lib/fonts";
import { useToast } from "@/context/ToastContext";
import authService from "@/appwrite/auth";
import configService from "@/appwrite/config";

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
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const currentUser = await authService.getCurrentUser().catch(() => null);
        setUser(currentUser);

        const response = await configService.getProducts();
        // Only show active products
        const activeProducts = response.documents.filter((p: any) => p.status === true);
        setProducts(activeProducts as unknown as ProductDoc[]);
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
        setWishlist(prev => ({ ...prev, [productId]: false }));
        showToast("Removed from Wishlist", "info");
      } else {
        // Appwrite attributes check: productId, userId
        await configService.addToWishlist({ productId, userId: user.$id });
        setWishlist(prev => ({ ...prev, [productId]: true }));
        showToast("Added to Wishlist!", "success");
      }
    } catch (error: any) {
      console.error(error);
      showToast("Check if 'productId' & 'userId' exist in Appwrite Wishlist Collection", "error");
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
      showToast(`${product.title} added to Cart!`, "success");
    } catch (error: any) {
      console.error(error);
      showToast("Check if 'productId', 'userId' & 'quantity' exist in Appwrite Cart Collection", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className={`${roboto.className} text-4xl font-black text-gray-900 tracking-tight`}>
            Premium <span className="text-red-600">Collections</span>
          </h1>
          <div className="h-1.5 w-20 bg-red-600 mt-2 rounded-full"></div>
        </div>
        <div className="bg-white shadow-sm border border-gray-100 px-6 py-2 rounded-2xl flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-gray-600 font-medium text-sm">{products.length} Items Live</span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center shadow-sm border border-gray-100">
             <div className="text-6xl mb-4">🛍️</div>
             <h2 className="text-2xl font-bold text-gray-800">No active products found.</h2>
             <p className="text-gray-500 mt-2">Check back later for fresh arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const isWished = wishlist[product.$id];

            return (
              <div 
                key={product.$id} 
                className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col relative"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-gray-100">
                  <img 
                    src={product.productImage || "https://fakeimg.pl/600x400/f3f4f6/9ca3af?text=No+Image"} 
                    alt={product.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                      {product.category || "General"}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    onClick={() => handleWishlist(product.$id)}
                    className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-red-50 transition-colors cursor-pointer group/wish"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill={isWished ? "#ef4444" : "none"} 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke={isWished ? "#ef4444" : "#1f2937"} 
                      className="w-5 h-5 transition-transform group-hover/wish:scale-125"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>

                  {/* Stock Badge */}
                  {product.stock < 10 && (
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-orange-500/90 backdrop-blur-md text-white text-center text-[10px] font-bold py-1.5 rounded-xl shadow-lg">
                           ONLY {product.stock} LEFT
                        </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="px-3 pt-5 pb-2 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                        {product.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 text-xs line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Action Section */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-gray-900">
                          ₹{product.price ? product.price.toLocaleString('en-IN') : "0"}
                        </span>
                    </div>
                    
                    <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-gray-900 hover:bg-red-600 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-red-200 active:scale-95 group/btn"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                       </svg>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
