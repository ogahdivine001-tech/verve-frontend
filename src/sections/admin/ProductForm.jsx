import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/productService";
import { uploadService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import Button from "../../components/Button";

export default function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [images, setImages] = useState(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialData });

  const { data: catData } = useQuery({ queryKey: ["categories"], queryFn: () => categoryService.getAll() });
  const categories = catData?.data || [];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadImages(files);
      setImages((prev) => [...prev, ...res.data.map((r) => r.url)]);
    } catch (err) {
      showToast(err.message || "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const submitForm = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      discount: Number(data.discount) || 0,
      stock: Number(data.stock),
      images,
      featured: !!data.featured,
      bestSeller: !!data.bestSeller,
      newArrival: !!data.newArrival,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Product Name</label>
          <input {...register("name", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">SKU</label>
          <input {...register("sku", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          {errors.sku && <p className="text-xs text-error mt-1">{errors.sku.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Short Description</label>
        <input {...register("shortDescription")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Description</label>
        <textarea rows={3} {...register("description", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink resize-none" />
        {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Price (₦)</label>
          <input type="number" {...register("price", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Discount (%)</label>
          <input type="number" {...register("discount")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Stock</label>
          <input type="number" {...register("stock", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Brand</label>
          <input {...register("brand")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Category</label>
        <select {...register("category", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink bg-paper">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-error mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Images</label>
        <div className="flex flex-wrap gap-3 mb-2">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 bg-ink text-paper w-5 h-5 rounded-full flex items-center justify-center">
                <X size={11} />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 border border-dashed border-line flex flex-col items-center justify-center cursor-pointer text-ink-soft/50 hover:border-ink">
            <Upload size={16} />
            <span className="text-[10px] mt-1">{uploading ? "..." : "Upload"}</span>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("featured")} /> Featured</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("bestSeller")} /> Best Seller</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register("newArrival")} /> New Arrival</label>
      </div>

      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>Save Product</Button>
      </div>
    </form>
  );
}
