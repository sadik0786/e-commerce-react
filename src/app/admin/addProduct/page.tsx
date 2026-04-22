"use client";

import { useState } from "react";
import configService from "@/appwrite/config";
import { Button, Input, Select } from "@/components/index";
import { roboto } from "@/lib/fonts";
import { useToast } from "@/context/ToastContext";

const categories = [
  "Jeans",
  "Shoes",
  "Laptop",
  "Watch",
  "Clothes",
  "Electronics",
  "Home Decor"
];

export default function AddProductPage() {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("100");
  const [status, setStatus] = useState("true"); // Default to active (as string for select)
  
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return showToast("Please select a category", "error");
    
    setIsLoading(true);

    try {
      await configService.addProduct({
        title,
        description,
        price: parseFloat(price),
        productImage: image, 
        slug: slug.trim() || title.toLowerCase().replace(/ /g, "-"),
        status: status === "true", // Convert string to boolean
        stock: parseInt(stock),
        category: category.toLowerCase(),
      });

      showToast("Product added successfully!", "success");
      
      // Clear form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setSlug("");
      setCategory("");
      setStock("100");
      
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Failed to add product.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 px-8 py-3">
          <h1 className={`${roboto.className} text-1xl font-bold text-white`}>
            Add New Product
          </h1>
          <p className="text-gray-300">Create a new listing for your store.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product Title"
                placeholder="e.g. Levi's 501 Jeans"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              
              <Input
                label="Product Slug (Optional)"
                placeholder="e.g. levis-501-jeans"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <Input
                label="Price ($)"
                type="number"
                placeholder="e.g. 99.99"
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
                label="Initial Stock"
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

            <Input
              label="Image URL"
              placeholder="https://example.com/item-image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Describe your product features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isLoading} className="px-8">
                {isLoading ? "Publishing..." : "Add Product to Store"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
