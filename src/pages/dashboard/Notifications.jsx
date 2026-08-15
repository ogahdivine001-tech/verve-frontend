import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { notificationService } from "../../services";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import { formatDate } from "../../utils/format";

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getMine(),
  });

  const notifications = data?.data || [];

  const markAllRead = async () => {
    await notificationService.markAllRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markRead = async (id) => {
    await notificationService.markRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  if (isLoading) return null;

  if (notifications.length === 0) {
    return <EmptyState icon={Bell} title="No notifications" message="Updates about your orders will appear here." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl">Notifications</h2>
        <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all as read</Button>
      </div>

      <div className="flex flex-col divide-y divide-line">
        {notifications.map((n) => (
          <button
            key={n._id}
            onClick={() => !n.isRead && markRead(n._id)}
            className={`text-left py-4 flex items-start gap-3 ${!n.isRead ? "bg-warm-grey/50" : ""}`}
          >
            <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? "bg-amber" : "bg-transparent"}`} />
            <div>
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-ink-soft/60 mt-0.5">{n.message}</p>
              <p className="text-[11px] text-ink-soft/40 mt-1">{formatDate(n.createdAt)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
