"use client";

import { useState, createContext, useContext } from "react";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

type ToastContextValue = {
  toast: (props: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString();
    setToasts((t) => [...t, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md border px-4 py-3 shadow-lg ${
              t.variant === "destructive"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : t.variant === "success"
                ? "border-green-500 bg-green-50 text-green-900"
                : "border-border bg-card text-card-foreground"
            }`}
          >
            <div className="font-medium">{t.title}</div>
            {t.description && (
              <div className="text-sm text-muted-foreground">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
