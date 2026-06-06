"use client";

import { Trash2 } from "lucide-react";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/shared/ui";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  itemName,
  isLoading,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hapus Item"
      size="sm"
      footer={
        <>
          <Button variant="default" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            <Trash2 size={13} />
            Ya, Hapus
          </Button>
        </>
      }
    >
      <div className="text-[13px] text-muted-foreground">
        Apakah kamu yakin ingin menghapus{" "}
        <strong className="text-foreground">"{itemName}"</strong>? Tindakan ini tidak
        dapat dibatalkan.
      </div>
    </Modal>
  );
}
