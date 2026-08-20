import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "../services/authService";
import { useAuthStore } from "../context/authStore";
import { useToastStore } from "../context/toastStore";
import Button from "../components/Button";

export default function ResetPassword() {
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const showToast = useToastStore((s) => s.showToast);
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await authService.resetPassword(token, data.password);
      localStorage.setItem("verve_token", res.data.token);
      useAuthStore.setState({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
      });
      showToast("Password reset. You're logged in.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      showToast(
        err.message || "This reset link is invalid or has expired",
        "error",
      );
    }
  };

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2 text-center">Reset Password</h1>
      <p className="text-sm text-ink-soft/60 text-center mb-8">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters",
                },
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
          {errors.password && (
            <p className="text-xs text-error mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-error mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="mt-2"
        >
          Reset Password
        </Button>
      </form>

      <p className="text-sm text-center text-ink-soft/60 mt-6">
        <Link to="/login" className="text-teal hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
