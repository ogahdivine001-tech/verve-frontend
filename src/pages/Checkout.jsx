import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Truck, Zap, Tag } from "lucide-react";
import { useCartStore } from "../context/cartStore";
import { useAuthStore } from "../context/authStore";
import { useToastStore } from "../context/toastStore";
import { paymentService, couponService } from "../services";
import Button from "../components/Button";
import CheckoutSteps from "../sections/checkout/CheckoutSteps";
import OrderSummarySidebar from "../sections/checkout/OrderSummarySidebar";
import EmptyState from "../components/EmptyState";
import { ShoppingBag } from "lucide-react";

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard Delivery", desc: "2-5 business days", price: 2000, icon: Truck },
  { id: "express", label: "Express Delivery", desc: "1-2 business days", price: 5000, icon: Zap },
];

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [formData, setFormData] = useState(null);

  const { items, subtotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Log in to checkout"
          message="Create an account or log in to complete your purchase."
          actionLabel="Log In"
          actionTo="/login"
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" actionLabel="Continue Shopping" actionTo="/shop" />
      </div>
    );
  }

  const selectedDelivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryMethod);
  const shipping = selectedDelivery.price;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await couponService.validate(couponCode.trim(), subtotal());
      setCouponDiscount(res.data.discount);
      showToast("Coupon applied");
    } catch (err) {
      setCouponError(err.message || "Invalid coupon");
      setCouponDiscount(0);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const onInfoSubmit = (data) => {
    setFormData(data);
    setStep(2);
  };

  const onShippingSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product._id,
          variantId: i.variantId || null,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
        },
        deliveryMethod,
        couponCode: couponDiscount > 0 ? couponCode.trim() : undefined,
      };

      const res = await paymentService.initialize(payload);
      window.location.href = res.data.authorizationUrl;
    } catch (err) {
      showToast(err.message || "Could not start payment", "error");
      setIsPaying(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8 text-center">Checkout</h1>
      <CheckoutSteps currentStep={step} />

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 max-w-5xl mx-auto">
        <div>
          {step === 1 && (
            <form onSubmit={handleSubmit(onInfoSubmit)} className="flex flex-col gap-4">
              <h2 className="font-display text-xl mb-2">Customer Information</h2>
              <div>
                <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Full Name</label>
                <input
                  {...register("fullName", { required: "Required" })}
                  className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
                {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Required" })}
                  className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
                {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Phone</label>
                <input
                  {...register("phone", { required: "Required" })}
                  className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
                {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
              </div>
              <Button type="submit" variant="primary" size="lg" className="mt-3">Continue to Shipping</Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onShippingSubmit)} className="flex flex-col gap-4">
              <h2 className="font-display text-xl mb-2">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Country</label>
                  <input
                    defaultValue="Nigeria"
                    {...register("country", { required: "Required" })}
                    className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">State</label>
                  <input
                    {...register("state", { required: "Required" })}
                    className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                  />
                  {errors.state && <p className="text-xs text-error mt-1">{errors.state.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">City</label>
                  <input
                    {...register("city", { required: "Required" })}
                    className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                  />
                  {errors.city && <p className="text-xs text-error mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Postal Code</label>
                  <input
                    {...register("postalCode")}
                    className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Address</label>
                <input
                  {...register("address", { required: "Required" })}
                  className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
                {errors.address && <p className="text-xs text-error mt-1">{errors.address.message}</p>}
              </div>
              <div className="flex gap-3 mt-3">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" variant="primary" size="lg" className="flex-1">Continue to Delivery</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-xl mb-2">Delivery Method</h2>
              {DELIVERY_OPTIONS.map(({ id, label, desc, price, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setDeliveryMethod(id)}
                  className={`flex items-center gap-4 p-4 border text-left ${
                    deliveryMethod === id ? "border-ink bg-warm-grey" : "border-line"
                  }`}
                >
                  <Icon size={20} className="text-amber flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-ink-soft/60">{desc}</p>
                  </div>
                  <span className="price-tag text-sm">₦{price.toLocaleString()}</span>
                </button>
              ))}
              <div className="flex gap-3 mt-3">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>Back</Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep(4)}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-xl mb-2">Payment</h2>

              <div>
                <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Coupon Code</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 border border-line px-3 flex-1">
                    <Tag size={14} className="text-ink-soft/40" />
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <Button variant="outline" onClick={handleApplyCoupon} loading={isApplyingCoupon}>
                    Apply
                  </Button>
                </div>
                {couponError && <p className="text-xs text-error mt-1.5">{couponError}</p>}
                {couponDiscount > 0 && <p className="text-xs text-success mt-1.5">Coupon applied successfully</p>}
              </div>

              <div className="bg-warm-grey p-4 text-sm">
                <p className="font-medium mb-1">Pay with Paystack</p>
                <p className="text-xs text-ink-soft/60">
                  You'll be redirected to Paystack's secure page to complete payment by card or bank transfer.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(3)}>Back</Button>
                <Button variant="primary" size="lg" className="flex-1" loading={isPaying} onClick={handlePayment}>
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </div>

        <OrderSummarySidebar
          items={items}
          subtotal={subtotal()}
          shipping={shipping}
          discount={couponDiscount}
          couponCode={couponCode}
        />
      </div>
    </div>
  );
}
