import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm", isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-soft/70 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={isLoading} className="flex-1">{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
