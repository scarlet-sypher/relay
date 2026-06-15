import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-green-400" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
};

const TOAST_STYLES: Record<ToastType, string> = {
  success: "border-green-500/20 bg-green-500/5",
  error: "border-red-500/20 bg-red-500/5",
  info: "border-blue-500/20 bg-blue-500/5",
  warning: "border-yellow-500/20 bg-yellow-500/5",
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  const value: ToastContextValue = {
    toast: addToast,
    success: (title, message) => addToast("success", title, message),
    error: (title, message) => addToast("error", title, message),
    info: (title, message) => addToast("info", title, message),
    warning: (title, message) => addToast("warning", title, message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border",
              "bg-surface-900 shadow-modal min-w-[300px] max-w-[400px]",
              "animate-slide-up",
              TOAST_STYLES[t.type],
            )}
          >
            <div className="mt-0.5 shrink-0">{TOAST_ICONS[t.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-100">{t.title}</p>
              {t.message && (
                <p className="text-xs text-surface-400 mt-0.5">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-surface-500 hover:text-surface-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
