import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Star } from "lucide-react";
import { userService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import { MapPin } from "lucide-react";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = async () => {
    setIsLoading(true);
    const res = await userService.getAddresses();
    setAddresses(res.data);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      const res = await userService.addAddress(data);
      setAddresses(res.data);
      showToast("Address added");
      reset();
      setShowForm(false);
    } catch (err) {
      showToast(err.message || "Could not add address", "error");
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const res = await userService.deleteAddress(addressId);
      setAddresses(res.data);
    } catch (err) {
      showToast(err.message || "Could not remove address", "error");
    }
  };

  const handleSetDefault = async (address) => {
    try {
      const res = await userService.updateAddress(address._id, { isDefault: true });
      setAddresses(res.data);
    } catch (err) {
      showToast(err.message || "Could not update address", "error");
    }
  };

  if (isLoading) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl">Addresses</h2>
        <Button variant="outline" size="sm" onClick={() => setShowForm((s) => !s)}>
          <Plus size={14} /> Add Address
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-line p-5 mb-8 grid grid-cols-2 gap-4">
          <input placeholder="Full Name" {...register("fullName", { required: true })} className="border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          <input placeholder="Phone" {...register("phone", { required: true })} className="border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          <input placeholder="Country" defaultValue="Nigeria" {...register("country", { required: true })} className="border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          <input placeholder="State" {...register("state", { required: true })} className="border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          <input placeholder="City" {...register("city", { required: true })} className="border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          <input placeholder="Postal Code" {...register("postalCode")} className="border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          <input placeholder="Address" {...register("address", { required: true })} className="col-span-2 border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
          <Button type="submit" variant="primary" size="sm" loading={isSubmitting} className="w-fit">Save Address</Button>
        </form>
      )}

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses saved" message="Add a shipping address for faster checkout." />
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div key={addr._id} className="border border-line p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{addr.fullName}</p>
                  {addr.isDefault && <span className="text-[10px] bg-teal-soft text-teal px-1.5 py-0.5">Default</span>}
                </div>
                <p className="text-xs text-ink-soft/60">{addr.address}, {addr.city}, {addr.state}</p>
                <p className="text-xs text-ink-soft/60">{addr.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr)} aria-label="Set as default" title="Set as default">
                    <Star size={15} className="text-ink-soft/40 hover:text-amber" />
                  </button>
                )}
                <button onClick={() => handleDelete(addr._id)} aria-label="Delete address">
                  <Trash2 size={15} className="text-ink-soft/40 hover:text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
