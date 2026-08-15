import { useForm } from "react-hook-form";
import { notificationService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import Button from "../../components/Button";

export default function AdminNotifications() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const showToast = useToastStore((s) => s.showToast);

  const onSubmit = async (data) => {
    try {
      const res = await notificationService.broadcast(data);
      showToast(res.message || "Notification sent");
      reset();
    } catch (err) {
      showToast(err.message || "Could not send notification", "error");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Notifications</h1>
      <p className="text-sm text-ink-soft/60 mb-6 max-w-md">
        Send a promotional notification to every active customer. This appears in their account notifications.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Title</label>
          <input {...register("title", { required: "Required" })} className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
          {errors.title && <p className="text-xs text-error mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Message</label>
          <textarea rows={3} {...register("message", { required: "Required" })} className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink resize-none" />
          {errors.message && <p className="text-xs text-error mt-1">{errors.message.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">Link (optional)</label>
          <input {...register("link")} placeholder="/shop?discount=true" className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink" />
        </div>
        <Button type="submit" variant="primary" loading={isSubmitting} className="w-fit">
          Send to All Customers
        </Button>
      </form>
    </div>
  );
}
