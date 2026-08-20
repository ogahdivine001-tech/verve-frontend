import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MailCheck } from "lucide-react";
import { authService } from "../services/authService";
import { useToastStore } from "../context/toastStore";
import Button from "../components/Button";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const showToast = useToastStore((s) => s.showToast);

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    }
  };

  if (sent) {
    return (
      <div className="container-page py-24 max-w-md mx-auto text-center">
        <MailCheck
          size={40}
          strokeWidth={1.25}
          className="text-teal mx-auto mb-5"
        />
        <h1 className="font-display text-2xl mb-3">Check your email</h1>
        <p className="text-sm text-ink-soft/60 mb-8">
          If an account exists for that email, we've sent a link to reset your
          password. It expires in 1 hour.
        </p>
        <Link to="/login" className="text-sm text-teal hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-16 max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2 text-center">
        Forgot Password
      </h1>
      <p className="text-sm text-ink-soft/60 text-center mb-8">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.email && (
            <p className="text-xs text-error mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="mt-2"
        >
          Send Reset Link
        </Button>
      </form>

      <p className="text-sm text-center text-ink-soft/60 mt-6">
        Remembered it?{" "}
        <Link to="/login" className="text-teal hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
