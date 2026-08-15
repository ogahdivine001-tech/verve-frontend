import { useAuthStore } from "../../context/authStore";

export default function AdminSettings() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Settings</h1>
      <div className="bg-paper border border-line p-6 max-w-md">
        <h2 className="text-sm font-medium mb-4">Admin Account</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft/60">Name</span>
            <span>{user?.firstName} {user?.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft/60">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft/60">Role</span>
            <span className="capitalize">{user?.role}</span>
          </div>
        </div>
        <p className="text-xs text-ink-soft/50 mt-5">
          Store-wide settings (branding, shipping rates, tax rules) can be added here as the platform grows.
        </p>
      </div>
    </div>
  );
}
