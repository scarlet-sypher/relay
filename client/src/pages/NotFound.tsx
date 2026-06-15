import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-screen gap-6">
    <div className="text-center">
      <p className="text-8xl font-black text-surface-800">404</p>
      <h1 className="text-2xl font-bold text-surface-200 mt-2">
        Page not found
      </h1>
      <p className="text-surface-500 mt-1">
        This page does not exist or has been moved.
      </p>
    </div>
    <Link to="/" className="btn-primary">
      <Home className="w-4 h-4" /> Back to Dashboard
    </Link>
  </div>
);
