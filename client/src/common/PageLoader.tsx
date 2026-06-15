import { Spinner } from "./Spinner";

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-surface-500">Loading...</p>
    </div>
  </div>
);
