"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import configService from "@/appwrite/config";
import rootConfig from "@/lib/rootConfig";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartItem {
  $id: string;
  productId: string;
  userId: string;
  quantity: number | string;
  price: number | string;
  productDetails?: any;
}

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCartItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await configService.getCart({ userId: user.$id });
      const items = response.documents as unknown as CartItem[];
      
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
      
      setCartItems(itemsWithDetails);
    } catch (error) {
      console.error("Error fetching cart", error);
      showToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchCartItems();
    }
  }, [user, authLoading]);

  const handleRemove = async (id: string) => {
    try {
      await configService.removeFromCart({ id });
      setCartItems((prev) => prev.filter((item) => item.$id !== id));
      showToast("Item removed from cart", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to remove item", "error");
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const currentItem = cartItems.find(item => item.$id === id);
      const quantityValue = typeof currentItem?.quantity === 'number' ? newQuantity : newQuantity.toString();
      
      await configService.updateCart({ id, quantity: quantityValue });
      setCartItems((prev) =>
        prev.map((item) =>
          item.$id === id ? { ...item, quantity: quantityValue } : item
        )
      );
    } catch (error: any) {
      showToast(error.message || "Failed to update quantity", "error");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.toString());
      const qty = parseInt(item.quantity.toString());
      return total + price * qty;
    }, 0);
  };

  const getImageUrl = (image: string) => {
    if (!image || image === "undefined") return "https://fakeimg.pl/600x800/f3f4f6/9ca3af?text=No+Image";
    if (typeof image === 'string' && image.startsWith("http")) return image;
    
    const project = rootConfig.appWriteProjectId;
    const bucket = rootConfig.appWriteBucketId;
    
    if (!project || project === "undefined" || !bucket || bucket === "undefined") {
      return `https://fakeimg.pl/600x800/f3f4f6/9ca3af?text=Missing+ID`;
    }

    return `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucket}/files/${image}/view?project=${project}`;
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 px-4 md:py-32 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
           <div className="max-w-2xl">
              <h1 className="text-7xl md:text-8xl font-black text-black tracking-tighter leading-[0.8] mb-6">
                 YOUR <span className="text-red-600">BAG</span>
              </h1>
              <p className="text-xl text-gray-400 font-medium italic">
                 Review your curated selection of luxury essentials before completing your order.
              </p>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-4xl font-black text-black tracking-tighter mb-2">₹{calculateTotal().toLocaleString('en-IN')}</span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">{cartItems.length} CURATED ITEMS</span>
           </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-gray-50 rounded-[4rem] p-24 text-center border border-gray-100 shadow-inner">
            <div className="text-9xl mb-10 opacity-20">👜</div>
            <h2 className="text-4xl font-black text-black mb-6 tracking-tight">YOUR BAG IS EMPTY</h2>
            <p className="text-gray-400 mb-12 max-w-md mx-auto text-lg font-medium">
              Every collection starts with a single piece. Explore our premium arrivals.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-4 bg-black text-white px-12 py-5 rounded-full font-black text-xl hover:bg-red-600 transition-all active:scale-95 shadow-2xl shadow-black/10"
            >
              Start Curating
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Cart Items Column */}
            <div className="lg:col-span-8 space-y-12">
              {cartItems.map((item) => (
                <div
                  key={item.$id}
                  className="group flex flex-col md:flex-row gap-10 items-start md:items-center pb-12 border-b border-gray-100 hover:border-black transition-colors duration-500"
                >
                  {/* Product Image */}
                  <div className="relative w-full md:w-56 aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden relative shadow-lg shadow-gray-200/50 group-hover:shadow-2xl transition-all duration-700">
                    <Image
                      src={getImageUrl(item.productDetails?.productImage)}
                      alt={item.productDetails?.title || "Product"}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 block mb-2">{item.productDetails?.category || "COLLECTION"}</span>
                          <h3 className="text-3xl font-black text-black tracking-tight leading-none group-hover:text-red-600 transition-colors">
                            {item.productDetails?.title || "Loading..."}
                          </h3>
                       </div>
                       <button
                         onClick={(e) => { e.preventDefault(); handleRemove(item.$id); }}
                         className="p-4 text-gray-200 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                       >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>

                    <p className="text-gray-400 font-medium line-clamp-1 max-w-md">
                       {item.productDetails?.description}
                    </p>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
                      {/* Quantity Control */}
                      <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100 relative z-10">
                        <button
                          onClick={(e) => { e.preventDefault(); handleUpdateQuantity(item.$id, parseInt(item.quantity.toString()) - 1); }}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black font-black text-xl transition-all"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-black text-black text-xl tracking-tighter">
                          {item.quantity}
                        </span>
                        <button
                          onClick={(e) => { e.preventDefault(); handleUpdateQuantity(item.$id, parseInt(item.quantity.toString()) + 1); }}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-black font-black text-xl transition-all"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Pricing */}
                      <div className="flex flex-col items-end">
                         <span className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">UNIT PRICE: ₹{parseFloat(item.price.toString()).toLocaleString('en-IN')}</span>
                         <span className="text-3xl font-black text-black tracking-tighter">
                           ₹{(parseFloat(item.price.toString()) * parseInt(item.quantity.toString())).toLocaleString('en-IN')}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div className="bg-black text-white rounded-[3.5rem] p-12 shadow-2xl shadow-black/20">
                  <h2 className="text-4xl font-black tracking-tighter mb-10">SUMMARY</h2>
                  
                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                      <span>Subtotal</span>
                      <span className="text-white text-lg tracking-tighter">₹{calculateTotal().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                      <span>Luxury Packaging</span>
                      <span className="text-green-500">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                      <span>Insured Shipping</span>
                      <span className="text-green-500">FREE</span>
                    </div>
                    
                    <div className="h-px bg-white/10 my-8"></div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Total</span>
                      <span className="text-5xl font-black tracking-tighter italic">₹{calculateTotal().toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full bg-white text-black hover:bg-red-600 hover:text-white text-center py-7 rounded-[2.5rem] font-black text-2xl tracking-tight transition-all duration-500 active:scale-95 shadow-xl shadow-black/5"
                  >
                    COMPLETE ORDER
                  </Link>
                  
                  <div className="mt-10 flex flex-col gap-4">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest text-center">WE ACCEPT PREMIUM PAYMENTS</p>
                     <div className="flex justify-center gap-6 opacity-30 grayscale invert">
                        <img src="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-topprod-stocks.svg" className="h-6" alt="visa" />
                        <img src="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-topprod-mf.svg" className="h-6" alt="master" />
                        <img src="https://d2inycshohpmtw.cloudfront.net/Content/landing2023/img/icon-topprod-insurance.svg" className="h-6" alt="amex" />
                     </div>
                  </div>
                </div>
                
                {/* Promo Code Card */}
                <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 flex flex-col gap-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">MEMBERSHIP PRIVILEGE</span>
                   <div className="flex gap-4">
                      <input type="text" placeholder="GIFT CODE" className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-xs focus:ring-2 focus:ring-black outline-none transition-all" />
                      <button className="bg-black text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors">Apply</button>
                   </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
