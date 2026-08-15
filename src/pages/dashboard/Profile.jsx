import { useForm } from "react-hook-form";
import { useAuthStore } from "../../context/authStore";
import { useToastStore } from "../../context/toastStore";
import { userService } from "../../services";
import Button from "../../components/Button";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm({
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone },
  });

  const onSubmit = async (data) => {
    try {
      const res = await userService.updateProfile(data);
      updateUser(res.data);
      showToast("Profile updated");
    } catch (err) {
      showToast(err.message || "Could not update profile", "error");
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="font-display text-xl mb-6">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">First Name</label>
            <input {...register("firstName")} className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Last Name</label>
            <input {...register("lastName")} className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Email</label>
          <input value={user?.email} disabled className="w-full border border-line px-3.5 py-2.5 text-sm bg-warm-grey text-ink-soft/60" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Phone</label>
          <input {...register("phone")} className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
        </div>
        <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty} className="w-fit mt-2">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
