"use client";

import { useToast } from "@/providers/ToastProvider";

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-md border border-border bg-background px-4 py-3 shadow-lg"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && <p className="text-sm text-secondary">{toast.description}</p>}
            </div>
            <button
              type="button"
              className="text-sm text-secondary hover:text-foreground"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
