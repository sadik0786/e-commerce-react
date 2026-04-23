"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import configService from "@/appwrite/config";
import rootConfig from "@/lib/rootConfig";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await configService.getProduct({ id: productId });
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product", error);
        showToast("Product not found", "error");
        router.push("/product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = async () => {
    if (!user) return showToast("Please login to add to cart", "error");
    try {
      setAddingToCart(true);
      await configService.addToCart({
        productId: product.$id,
        userId: user.$id,
        quantity: quantity.toString(),
        price: product.price.toString(),
      });
      showToast(`${product.title} added to cart!`, "success");
    } catch (error) {
      showToast("Failed to add to cart", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageUrl = (image: string) => {
    if (!image || image === "undefined") return "https://fakeimg.pl/1000x1200/f3f4f6/9ca3af?text=No+Image";
    if (typeof image === 'string' && image.startsWith("http")) return image;
    
    const project = rootConfig.appWriteProjectId;
    const bucket = rootConfig.appWriteBucketId;
    
    if (!project || project === "undefined" || !bucket || bucket === "undefined") {
      return `https://fakeimg.pl/1000x1200/f3f4f6/9ca3af?text=Missing+ID`;
    }

    return `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucket}/files/${image}/view?project=${project}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white selection:bg-red-100 selection:text-red-900">
      
      {/* Header spacer removed for sticky header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-12">
           <Link href="/product" className="hover:text-black transition-colors">Shop</Link>
           <span className="text-gray-200">/</span>
           <span className="text-black">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Left Column: Visuals (5 cols) */}
          <div className="lg:col-span-6 relative">
             <div className="sticky top-32 space-y-8">
                {/* Main Product Frame */}
                <div className="relative aspect-[4/5] rounded-[3rem] bg-gray-50 overflow-hidden group shadow-2xl shadow-gray-200/50">
                   {/* Background Glow */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-100/30 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                   
                   <Image 
                     src={getImageUrl(product.productImage)} 
                     alt={product.title}
                     fill
                     unoptimized={true}
                     className="object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                     priority
                   />
                   
                   {/* Overlay Glass Badge */}
                   <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/40 backdrop-blur-2xl border border-white/40 rounded-3xl flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="font-black text-black tracking-tighter text-lg uppercase">Authentic Edition</span>
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                   </div>
                </div>

                {/* Secondary Feature Grid */}
                <div className="grid grid-cols-3 gap-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 hover:border-red-200 transition-colors cursor-pointer group">
                        <Image 
                          src={getImageUrl(product.productImage)} 
                          alt="detail" 
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Column: Narrative (6 cols) */}
          <div className="lg:col-span-6 flex flex-col pt-4">
             
             {/* Header */}
             <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                   <span className="px-5 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                      {product.category || "Exclusive"}
                   </span>
                   {product.stock > 0 ? (
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600">
                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                         Available Now
                      </span>
                   ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Out of Stock</span>
                   )}
                </div>

                <h1 className="text-6xl xl:text-7xl font-black text-black leading-[0.9] tracking-tighter mb-8">
                   {product.title}
                </h1>

                <div className="flex items-baseline gap-4 mb-10">
                   <span className="text-5xl font-black text-black tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
                   <span className="text-xl text-gray-300 font-bold line-through">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
                   <span className="ml-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg">20% OFF</span>
                </div>
             </div>

             {/* Dynamic Tabs Section */}
             <div className="mb-12 border-b border-gray-100">
                <div className="flex gap-10">
                   {['description', 'details', 'shipping'].map(tab => (
                     <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-black' : 'text-gray-300 hover:text-gray-500'}`}
                     >
                       {tab}
                       {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 rounded-full"></div>}
                     </button>
                   ))}
                </div>
             </div>

             <div className="min-h-[120px] mb-12">
                {activeTab === 'description' && (
                   <p className="text-xl text-gray-500 leading-relaxed font-medium">
                      {product.description || "Indulge in the epitome of craftsmanship. This curated piece brings together timeless design and contemporary performance, ensuring every interaction feels premium and purposeful."}
                   </p>
                )}
                {activeTab === 'details' && (
                   <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      {[['Material', 'Premium Grade'], ['Style', 'Modern Luxury'], ['Durability', 'High Endurance'], ['Finish', 'Matte Satin']].map(([k,v]) => (
                        <div key={k} className="flex flex-col border-b border-gray-50 pb-2">
                           <span className="text-[10px] uppercase font-black text-gray-300">{k}</span>
                           <span className="text-sm font-bold text-black">{v}</span>
                        </div>
                      ))}
                   </div>
                )}
                {activeTab === 'shipping' && (
                   <p className="text-lg text-gray-500 font-medium italic">
                      Complimentary premium delivery on all orders. Carefully packaged in our signature box to ensure your item arrives in pristine condition. Expected delivery: 3-5 business days.
                   </p>
                )}
             </div>

             {/* Interactive Controls */}
             <div className="space-y-8 mt-auto">
                <div className="flex items-center gap-6">
                   <div className="flex-1 flex items-center bg-gray-50 rounded-[2rem] p-2 border border-gray-100">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-14 h-14 rounded-full hover:bg-white hover:shadow-md text-black font-black text-2xl transition-all"
                      >
                         −
                      </button>
                      <span className="flex-1 text-center font-black text-2xl tracking-tighter">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-14 h-14 rounded-full hover:bg-white hover:shadow-md text-black font-black text-2xl transition-all"
                      >
                         +
                      </button>
                   </div>
                   
                   <button className="w-18 h-18 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 transition-all active:scale-90">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock <= 0}
                  className="w-full h-24 bg-black hover:bg-red-600 disabled:bg-gray-200 text-white rounded-[2.5rem] font-black text-2xl tracking-tight transition-all duration-500 shadow-2xl shadow-black/10 hover:shadow-red-600/30 flex items-center justify-center gap-4 active:scale-[0.97]"
                >
                   {addingToCart ? (
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                      <>
                        <span>Add to Collection</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </>
                   )}
                </button>
             </div>

             {/* Footer Trust Section */}
             <div className="mt-16 flex items-center justify-between py-8 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Global Shipping</span>
                   <span className="text-xs font-bold text-black">Ships to 120+ countries</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                   <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Quality Promise</span>
                   <span className="text-xs font-bold text-black">2 Year Luxury Warranty</span>
                </div>
             </div>

          </div>
        </div>
      </div>

      {/* Recommended Section (Visual Placeholder) */}
      <div className="bg-gray-50 py-32 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-5xl font-black text-black tracking-tighter mb-20 text-center">Complete the <span className="text-red-600 underline decoration-8 underline-offset-8">Look</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => (
                 <div key={i} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] bg-white rounded-3xl mb-6 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                       <Image src={getImageUrl(product.productImage)} alt="rec" fill unoptimized className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <h4 className="font-black text-black uppercase text-[10px] tracking-[0.2em]">Essentials Edition</h4>
                 </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}
