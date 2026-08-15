import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { couponService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Badge from "../../components/Badge";
import { formatDate } from "../../utils/format";

export default function AdminCoupons() {
  const [showForm, setShowForm] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["admin-coupons"], queryFn: () => couponService.getAll() });
  const coupons = data?.data || [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setIsSaving(true);
    try {
      await couponService.create({
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrder: Number(formData.minOrder) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      });
      showToast("Coupon created");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setShowForm(false);
      reset();
    } catch (err) {
      showToast(err.message || "Could not create coupon", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await couponService.remove(deletingCoupon._id);
      showToast("Coupon deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setDeletingCoupon(null);
    } catch (err) {
      showToast(err.message || "Could not delete coupon", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Coupons</h1>
        <Button variant="primary" size="sm" onClick={() => { reset({}); setShowForm(true); }}>
          <Plus size={14} /> Add Coupon
        </Button>
      </div>

      {!isLoading && (
        <div className="bg-paper border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft/50">
                <th className="text-left py-3 px-4">Code</th>
                <th className="text-left py-3 px-4">Discount</th>
                <th className="text-left py-3 px-4">Min Order</th>
                <th className="text-left py-3 px-4">Expires</th>
                <th className="text-left py-3 px-4">Used</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-line last:border-0">
                  <td className="py-3 px-4 price-tag">{c.code}</td>
                  <td className="py-3 px-4">{c.discountType === "percentage" ? `${c.discountValue}%` : `₦${c.discountValue.toLocaleString()}`}</td>
                  <td className="py-3 px-4">₦{c.minOrder.toLocaleString()}</td>
                  <td className="py-3 px-4 text-ink-soft/60">{formatDate(c.expiresAt)}</td>
                  <td className="py-3 px-4">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td className="py-3 px-4"><Badge variant={c.isActive ? "teal" : "error"}>{c.isActive ? "Active" : "Inactive"}</Badge></td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => setDeletingCoupon(c)} aria-label="Delete coupon">
                      <Trash2 size={14} className="text-ink-soft/60 hover:text-error inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Coupon" maxWidth="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Code</label>
            <input {...register("code", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink uppercase" />
            {errors.code && <p className="text-xs text-error mt-1">{errors.code.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Discount Type</label>
              <select {...register("discountType", { required: true })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink bg-paper">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Discount Value</label>
              <input type="number" {...register("discountValue", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Min Order (₦)</label>
              <input type="number" {...register("minOrder")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Max Discount (₦)</label>
              <input type="number" {...register("maxDiscount")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Expires At</label>
              <input type="date" {...register("expiresAt", { required: "Required" })} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
              {errors.expiresAt && <p className="text-xs text-error mt-1">{errors.expiresAt.message}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Usage Limit</label>
              <input type="number" {...register("usageLimit")} className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={isSaving}>Create Coupon</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingCoupon}
        onClose={() => setDeletingCoupon(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message={`Delete coupon "${deletingCoupon?.code}"?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
