import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { productService } from "../../services/productService";
import { useToastStore } from "../../context/toastStore";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import ProductForm from "../../sections/admin/ProductForm";
import PriceTag from "../../components/PriceTag";
import Badge from "../../components/Badge";
import { ProductGridSkeleton } from "../../components/Loading";
import Pagination from "../../components/Pagination";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search, page],
    queryFn: () => productService.getAll({ search, page, limit: 10 }),
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  const openCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, formData);
        showToast("Product updated");
      } else {
        await productService.create(formData);
        showToast("Product created");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowForm(false);
    } catch (err) {
      showToast(err.message || "Could not save product", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.remove(deletingProduct._id);
      showToast("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeletingProduct(null);
    } catch (err) {
      showToast(err.message || "Could not delete product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl">Products</h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={14} /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2 border border-line px-3 py-2 max-w-sm mb-6 bg-paper">
        <Search size={14} className="text-ink-soft/40" />
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 outline-none text-sm bg-transparent"
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={5} />
      ) : (
        <div className="bg-paper border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft/50">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-line last:border-0">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover bg-warm-grey" />
                    <span className="line-clamp-1">{p.name}</span>
                  </td>
                  <td className="py-3 px-4 text-ink-soft/60">{p.category?.name}</td>
                  <td className="py-3 px-4"><PriceTag price={p.finalPrice} size="sm" /></td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">
                    <Badge variant={p.stock > 0 ? "teal" : "error"}>{p.stock > 0 ? "In Stock" : "Out of Stock"}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(p)} aria-label="Edit product">
                        <Pencil size={14} className="text-ink-soft/60 hover:text-ink" />
                      </button>
                      <button onClick={() => setDeletingProduct(p)} aria-label="Delete product">
                        <Trash2 size={14} className="text-ink-soft/60 hover:text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={pagination?.page || 1} pages={pagination?.pages || 1} onChange={setPage} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingProduct ? "Edit Product" : "New Product"}>
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={isSaving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
