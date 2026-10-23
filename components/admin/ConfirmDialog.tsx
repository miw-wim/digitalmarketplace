"use client";
import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", confirmClass, onConfirm, onCancel, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div ref={ref} tabIndex={-1} className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 outline-none">
        <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-4">{message}</p>
        {children}
        <div className="flex gap-2 justify-end mt-4">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${confirmClass ?? "bg-violet-600 hover:bg-violet-500"}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
