import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState({ icon: Icon, title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {Icon && <Icon size={40} strokeWidth={1.25} className="text-ink-soft/40 mb-5" />}
      <h3 className="font-display text-xl mb-2">{title}</h3>
      {message && <p className="text-ink-soft/70 max-w-sm mb-6">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
