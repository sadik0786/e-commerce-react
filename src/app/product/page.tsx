"use client";

import { useEffect, useState } from "react";
import { Models } from "appwrite";
import Button from "@/components/Button";
import { roboto } from "@/lib/fonts";
import { useToast } from "@/context/ToastContext";
import authService from "@/appwrite/auth";
import configService from "@/appwrite/config";

// Blueprint for what we expect back from the Appwrite product collection
interface ProductDoc extends Models.Document {
  title: string;
  description: string;
  price: number;
  productImage: string; // Updated to match Appwrite schema
  slug: string;
  status: string;
  stock: number;
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
        // Fetch current user
        const currentUser = await authService.getCurrentUser().catch(() => null);
        setUser(currentUser);

        // Fetch products
        const response = await configService.getProducts();
        setProducts(response.documents as unknown as ProductDoc[]);

        // If logged in, you could also fetch their existing wishlist here
        // (For now we keep the local toggle state)
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
        // Remove from wishlist (Logic would go here with configService.removeFromWishlist)
        setWishlist(prev => ({ ...prev, [productId]: false }));
        showToast("Removed from Wishlist", "info");
      } else {
        await configService.addToWishlist({ productId, userId: user.$id });
        setWishlist(prev => ({ ...prev, [productId]: true }));
        showToast("Added to Wishlist!", "success");
      }
    } catch (error) {
      showToast("Failed to update wishlist", "error");
    }
  };

  const handleAddToCart = async (product: ProductDoc) => {
    if (!user) return showToast("Please login to add items to cart", "error");

    try {
      await configService.addToCart({
        productId: product.$id,
        userId: user.$id,
        quantity: 1
      });
      showToast(`${product.title} added to Card!`, "success");
    } catch (error) {
      showToast("Failed to add to cart", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Securely Loading Assets...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className={`${roboto.className} text-4xl font-extrabold text-gray-900 border-b-4 border-red-500 inline-block pb-2`}>
          Financial Products
        </h1>
        <p className="text-gray-500 bg-gray-100 px-4 py-2 rounded-lg font-medium">
          {products.length} Products Found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-xl text-center border-2 border-dashed border-gray-200">
             <h2 className="text-2xl font-bold text-gray-800">No products available.</h2>
             <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Appwrite successfully connected, but your product collection is empty! Add documents to your Appwrite Dashboard using the standard fields <strong>(title, description, price, image, item_no)</strong>.
             </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const isWished = wishlist[product.$id];

            return (
              <div 
                key={product.$id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative group"
              >
                
                <button 
                  onClick={() => handleWishlist(product.$id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  title="Add to Wishlist"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill={isWished ? "#ef4444" : "none"} 
                    viewBox="0 0 24 24" 
                    strokeWidth={isWished ? 0 : 1.5} 
                    stroke={isWished ? "red" : "currentColor"} 
                    className={`w-6 h-6 ${isWished ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>

                {/* Product Image Area */}
                <div className="relative h-60 w-full bg-gray-50 overflow-hidden border-b border-gray-100">
                  {/* Standard img tag guarantees render from ANY external generic storage URL without needing strict Next.js next.config.ts host whitelistings */}
                  <img 
                    src={product.productImage || "https://fakeimg.pl/600x400/f3f4f6/9ca3af?text=No+Image"} 
                    alt={product.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  {/* Badges: ID (formerly SKU) */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1">
                    <div className="bg-red-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm uppercase">
                      ID: {product.$id}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2" title={product.title}>
                    {product.title || "Untitled Product"}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 min-h-[60px]">
                    {product.description || "No description provided."}
                  </p>
                  
                  {/* Footer / Cart Action */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Price</span>
                        <span className="text-2xl font-black text-red-600">
                          ${product.price ? product.price.toFixed(2) : "0.00"}
                        </span>
                    </div>
                    
                    <Button 
                        variant="primary" 
                        className="text-sm px-6 shadow-md hover:shadow-lg"
                        onClick={() => handleAddToCart(product)}
                    >
                       + Add Item
                    </Button>
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
