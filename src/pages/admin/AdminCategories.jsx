import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryService } from "../../services/productService";
import { useToastStore } from "../../context/toastStore";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function AdminCategories() {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["categories"], queryFn: () => categoryService.getAll() });
  const categories = data?.data || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const openCreate = () => { reset({ name: "", description: "", image: "" }); setEditingCategory(null); setShowForm(true); };
  const openEdit = (cat) => { reset(cat); setEditingCategory(cat); setShowForm(true); };

  const onSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
        showToast("Category updated");
      } else {
        await categoryService.create(formData);
        showToast("Category created");
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowForm(false);
    } catch (err) {
      showToast(err.message || "Could not save category", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await categoryService.remove(deletingCategory._id);
      showToast("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeletingCategory(null);
    } catch (err) {
      showToast(err.message || "Could not delete category", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Categories</h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={14} /> Add Category
        </Button>
      </div>

      {!isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-paper border border-line p-4 flex items-center gap-3">
              <img src={cat.image} alt="" className="w-14 h-14 object-cover bg-warm-grey flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{cat.name}</p>
                <p className="text-xs text-ink-soft/50 line-clamp-1">{cat.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => openEdit(cat)} aria-label="Edit category">
                  <Pencil size={14} className="text-ink-soft/60 hover:text-ink" />
                </button>
                <button onClick={() => setDeletingCategory(cat)} aria-label="Delete category">
                  <Trash2 size={14} className="text-ink-soft/60 hover:text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingCategory ? "Edit Category" : "New Category"} maxWidth="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Name</label>
            <input {...register("name", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
            {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Description</label>
            <textarea rows={2} {...register("description")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink resize-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Image URL</label>
            <input {...register("image")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          </div>
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSaving}>Save Category</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Delete "${deletingCategory?.name}"? Products in this category will not be deleted.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
