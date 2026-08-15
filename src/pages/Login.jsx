import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../context/authStore";
import { useCartStore } from "../context/cartStore";
import { useWishlistStore } from "../context/wishlistStore";
import { useToastStore } from "../context/toastStore";
import Button from "../components/Button";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const login = useAuthStore((s) => s.login);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);
  const showToast = useToastStore((s) => s.showToast);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      await mergeGuestCart();
      await loadWishlist();
      showToast(`Welcome back, ${user.firstName}`);
      const redirectTo = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showToast(err.message || "Login failed", "error");
    }
  };

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2 text-center">Welcome Back</h1>
      <p className="text-sm text-ink-soft/60 text-center mb-8">Log in to continue to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs uppercase tracking-wide text-ink-soft/60">Password</label>
            <Link to="/forgot-password" className="text-xs text-teal hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("remember")} />
          Remember me
        </label>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-2">
          Log In
        </Button>
      </form>

      <p className="text-sm text-center text-ink-soft/60 mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-teal hover:underline">Create one</Link>
      </p>
    </div>
  );
}
