import React from 'react';
import { CheckCircle2, AlertCircle, ShoppingBag, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-red-700/60 shadow-2xl shadow-red-950/80 text-white animate-slide-in backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-red-950">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-neutral-300 truncate">{toast.message}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
