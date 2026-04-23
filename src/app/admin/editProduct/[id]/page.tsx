"use client";

import { useEffect, useState, useRef, use } from "react";
import configService from "@/appwrite/config";
import rootConfig from "@/lib/rootConfig";
import { Button, Input, Select } from "@/components/index";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  "Jeans",
  "Shoes",
  "Laptop",
  "Watch",
  "Clothes",
  "Electronics",
  "Home Decor"
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("10");
  const [status, setStatus] = useState("true");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await configService.getProduct({ id: productId });
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price.toString());
          setSlug(data.slug);
          setCategory(data.category.charAt(0).toUpperCase() + data.category.slice(1));
          setStock(data.stock.toString());
          setStatus(data.status ? "true" : "false");
          setExistingImageUrl(data.productImage);
          setImagePreview(getImageUrl(data.productImage));
        }
      } catch (error) {
        showToast("Product not found", "error");
        router.push("/admin/listProduct");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, router]);

  const getImageUrl = (image: string) => {
    if (!image || image === "undefined") return null;
    if (typeof image === 'string' && image.startsWith("http")) return image;
    const project = rootConfig.appWriteProjectId;
    const bucket = rootConfig.appWriteBucketId;
    if (!project || project === "undefined" || !bucket || bucket === "undefined") return null;
    return `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucket}/files/${image}/view?project=${project}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = existingImageUrl;

      // 1. If new image selected, upload it
      if (imageFile) {
        const uploadedFile = await configService.uploadFile(imageFile);
        if (uploadedFile) {
           // Delete old file if it was an Appwrite ID
           if (existingImageUrl && !existingImageUrl.startsWith('http')) {
              await configService.deleteFile(existingImageUrl);
           }
           finalImageUrl = uploadedFile.$id;
        }
      }

      // 2. Update Database
      await configService.updateProduct({
        id: productId,
        title,
        description,
        price: parseFloat(price),
        productImage: finalImageUrl, 
        slug: slug.trim() || title.toLowerCase().replace(/ /g, "-"),
        status: status === "true",
        stock: parseInt(stock),
        category: category.toLowerCase(),
      });

      showToast("Product updated successfully!", "success");
      router.push("/admin/listProduct");
      
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Failed to update product.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Form Column */}
        <div className="flex-1">
          <div className="mb-10">
             <Link href="/admin/listProduct" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors mb-4 inline-block">← Back to Inventory</Link>
             <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">EDIT <span className="text-red-600">PRODUCT</span></h1>
             <p className="text-gray-500 font-medium italic">Modify the details of your luxury listing.</p>
          </div>

          <form onSubmit={handleUpdateProduct} className="space-y-8 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Product Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <Input
                label="Slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <Input
                label="Price (₹)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <Select
                label="Category"
                options={categories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />

               <Input
                label="Stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />

              <Select
                label="Status"
                options={["Active", "Inactive"]}
                value={status === "true" ? "Active" : "Inactive"}
                onChange={(e) => setStatus(e.target.value === "Active" ? "true" : "false")}
                required
              />
            </div>

            {/* File Upload Section */}
            <div>
               <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Product Visual</label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full h-32 border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-200 hover:bg-red-50 transition-all group"
               >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden" 
                    accept="image/*"
                  />
                  <svg className="w-8 h-8 text-gray-300 group-hover:text-red-500 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{imageFile ? imageFile.name : "Replace existing image"}</p>
               </div>
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
              <textarea
                rows={3}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium text-gray-900"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-black hover:bg-red-600 text-white py-6 rounded-3xl font-black text-xl tracking-tight transition-all duration-500 active:scale-[0.98] shadow-2xl shadow-black/10 flex items-center justify-center gap-3"
            >
              {isSaving ? (
                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                 <>
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   Save Changes
                 </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Column */}
        <div className="w-full lg:w-96">
           <div className="sticky top-32">
              <span className="inline-block text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-4">Updated Preview</span>
              <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-gray-50 group">
                 <div className="aspect-[1/1] bg-gray-50 rounded-[2rem] overflow-hidden relative mb-6">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                 </div>
                 <div className="px-2 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">{category || "Category"}</span>
                    <h3 className="text-xl font-black text-black tracking-tighter line-clamp-1">{title || "Product Title"}</h3>
                    <p className="text-xl font-black text-black tracking-tighter">₹{price ? parseInt(price).toLocaleString('en-IN') : "0"}</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
