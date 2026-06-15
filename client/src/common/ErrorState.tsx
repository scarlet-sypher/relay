import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4">
    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
      <AlertCircle className="w-6 h-6 text-red-400" />
    </div>
    <div className="text-center">
      <p className="text-surface-200 font-medium">Error</p>
      <p className="text-sm text-surface-500 mt-1">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary">
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    )}
  </div>
);
