import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Button from "../components/Button";
import { useToastStore } from "../context/toastStore";
import { contactService } from "../services";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const showToast = useToastStore((s) => s.showToast);

  const onSubmit = async (data) => {
    try {
      const res = await contactService.submit(data);
      showToast(
        res.message || "Message sent. We'll get back to you within 24 hours.",
      );
      reset();
    } catch (err) {
      showToast(
        err.message || "Could not send your message. Please try again.",
        "error",
      );
    }
  };

  return (
    <div className="container-page py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl mb-3">Get in Touch</h1>
        <p className="text-sm text-ink-soft/60">
          Questions about an order or a product? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex gap-3">
            <Mail size={17} className="text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-ink-soft/60">support@verve.com</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone size={17} className="text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-ink-soft/60">+234 800 000 0000</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin size={17} className="text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-ink-soft/60">
                12 Commerce Street, Abuja, Nigeria
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock size={17} className="text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Hours</p>
              <p className="text-sm text-ink-soft/60">Mon-Fri, 9am-6pm WAT</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
                Name
              </label>
              <input
                {...register("name", { required: "Required" })}
                className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
              {errors.name && (
                <p className="text-xs text-error mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Required" })}
                className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
              {errors.email && (
                <p className="text-xs text-error mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
              Phone
            </label>
            <input
              {...register("phone")}
              className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
              Subject
            </label>
            <input
              {...register("subject", { required: "Required" })}
              className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
            />
            {errors.subject && (
              <p className="text-xs text-error mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-soft/60 block mb-1.5">
              Message
            </label>
            <textarea
              rows={4}
              {...register("message", { required: "Required" })}
              className="w-full border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink resize-none"
            />
            {errors.message && (
              <p className="text-xs text-error mt-1">
                {errors.message.message}
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
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
