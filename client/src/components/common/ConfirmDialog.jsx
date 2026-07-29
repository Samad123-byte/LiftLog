import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  copy,
  loading,
  confirmLabel = "Delete",
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm leading-6 text-muted">
        {copy || "This action cannot be undone."}
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
