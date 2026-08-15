import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../context/authStore";
import { useToastStore } from "../../context/toastStore";
import Button from "../../components/Button";

export default function Security() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const logout = useAuthStore((s) => s.logout);
  const showToast = useToastStore((s) => s.showToast);
  const navigate = useNavigate();
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      await authService.changePassword(data);
      showToast("Password updated");
      reset();
    } catch (err) {
      showToast(err.message || "Could not update password", "error");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="max-w-md">
      <h2 className="font-display text-xl mb-6">Security</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-10">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Current Password</label>
          <input
            type="password"
            {...register("currentPassword", { required: "Required" })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.currentPassword && <p className="text-xs text-error mt-1">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">New Password</label>
          <input
            type="password"
            {...register("newPassword", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.newPassword && <p className="text-xs text-error mt-1">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Confirm New Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Required",
              validate: (v) => v === newPassword || "Passwords do not match",
            })}
            className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" variant="primary" loading={isSubmitting} className="w-fit">
          Update Password
        </Button>
      </form>

      <div className="border-t border-line pt-6">
        <Button variant="danger" size="sm" onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  );
}
