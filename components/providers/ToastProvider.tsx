"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

type ToastType = "success" | "info" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 1500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] flex flex-col gap-2 w-full max-w-xs px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={clsx(
                "p-4 rounded-2xl shadow-lg border flex items-center justify-center gap-3 text-sm font-medium text-white pointer-events-auto",
                toast.type === "success" && "bg-vert border-vert-dark",
                toast.type === "info" && "bg-matcha border-matcha-dark",
                toast.type === "error" && "bg-red-500 border-red-600",
              )}
            >
              {toast.type === "success" && <CheckCircle2 size={16} />}
              {toast.type === "info" && <AlertCircle size={16} />}
              {toast.type === "error" && <AlertCircle size={16} />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
