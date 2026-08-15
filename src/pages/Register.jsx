import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../context/authStore";
import { useCartStore } from "../context/cartStore";
import { useToastStore } from "../context/toastStore";
import Button from "../components/Button";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const registerUser = useAuthStore((s) => s.register);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);
  const showToast = useToastStore((s) => s.showToast);
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const user = await registerUser(data);
      await mergeGuestCart();
      showToast(`Welcome to Verve, ${user.firstName}`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      showToast(err.message || "Registration failed", "error");
    }
  };

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2 text-center">Create Account</h1>
      <p className="text-sm text-ink-soft/60 text-center mb-8">Join Verve and start shopping</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">First Name</label>
            <input
              {...register("firstName", { required: "Required" })}
              className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
            {errors.firstName && <p className="text-xs text-error mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Last Name</label>
            <input
              {...register("lastName", { required: "Required" })}
              className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
            {errors.lastName && <p className="text-xs text-error mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Phone</label>
          <input
            {...register("phone", { required: "Phone number is required" })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" },
              })}
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

        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-sm text-center text-ink-soft/60 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-teal hover:underline">Log in</Link>
      </p>
    </div>
  );
}
