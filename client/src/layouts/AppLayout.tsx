import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Filter,
  Send,
  BarChart3,
  Sparkles,
  Activity,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";
import { APP_NAME } from "../constants";

const NAV = [
  { path: "/", label: "Dashboard", Icon: LayoutDashboard },
  { path: "/customers", label: "Customers", Icon: Users },
  { path: "/segments", label: "Segments", Icon: Filter },
  { path: "/campaigns", label: "Campaigns", Icon: Send },
  { path: "/analytics", label: "Analytics", Icon: BarChart3 },
  { path: "/ai", label: "AI Studio", Icon: Sparkles },
  { path: "/health", label: "Health", Icon: Activity },
];

const NavItem = ({
  path,
  label,
  Icon,
  onClick,
}: {
  path: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}) => {
  const location = useLocation();
  const isActive =
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-brand-600/20 text-brand-400 border border-brand-600/30"
          : "text-surface-400 hover:text-surface-100 hover:bg-surface-800 border border-transparent",
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </NavLink>
  );
};

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-surface-900 border-r border-surface-800">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-surface-800 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-surface-50 tracking-tight">
            {APP_NAME}
          </span>
          <span className="text-2xs text-surface-600 font-medium ml-auto border border-surface-700 px-1.5 py-0.5 rounded">
            CRM
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>
        <div className="p-4 border-t border-surface-800">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center">
              <span className="text-2xs font-bold text-brand-400">G</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-200 truncate">
                Growth Team
              </p>
              <p className="text-2xs text-surface-600 truncate">relay.crm</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-64 h-full bg-surface-900 border-r border-surface-800">
            <div className="flex items-center justify-between px-5 h-16 border-b border-surface-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-surface-50">{APP_NAME}</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="btn-ghost p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
              {NAV.map((item) => (
                <NavItem
                  key={item.path}
                  {...item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-surface-900 border-b border-surface-800 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="btn-ghost p-1.5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-surface-50 text-sm">
              {APP_NAME}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
