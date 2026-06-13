"use client";

import { useEffect, useState } from "react";
import { IconAlert, IconCheck, IconX } from "@/components/icons";
import { cn } from "@/lib/utils";

type ToastType = "success" | "info" | "warning" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeConfig: Record<
  ToastType,
  { container: string; icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  success: {
    container: "border-green-200 bg-green-50 text-green-900",
    icon: IconCheck,
    label: "Success",
  },
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-900",
    icon: IconAlert,
    label: "Info",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    icon: IconAlert,
    label: "Warning",
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    icon: IconAlert,
    label: "Error",
  },
};

const iconColors: Record<ToastType, string> = {
  success: "text-green-600",
  info: "text-blue-600",
  warning: "text-amber-600",
  error: "text-red-600",
};

export function Toast({ message, type = "info", duration = 3500, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const showTimer = requestAnimationFrame(() => setVisible(true));
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 250);
    }, duration);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "pointer-events-auto fixed left-1/2 top-4 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-300 ease-out sm:top-6",
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/10 ring-1 ring-black/5",
          config.container
        )}
      >
        <div className={cn("mt-0.5 shrink-0", iconColors[type])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{config.label}</p>
          <p className="mt-0.5 text-sm font-medium leading-snug">{message}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg p-1 opacity-60 transition-opacity hover:bg-black/5 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  const ToastContainer = () =>
    toast ? (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      </div>
    ) : null;

  return { showToast, ToastContainer };
}
