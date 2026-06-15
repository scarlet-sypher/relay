import { NavLink, useLocation, Link } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "../utils";
import { APP_NAME } from "../constants";

const NAV = [
  { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
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
  isOpen,
}: {
  path: string;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isOpen: boolean;
}) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(path);

  return (
    <NavLink
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-brand-600/20 text-brand-400 border border-brand-600/30 shadow-[0_0_10px_rgba(79,70,229,0.1)]"
          : "text-surface-400 hover:text-surface-100 hover:bg-surface-800 border border-transparent",
        !isOpen && "justify-center"
      )}
      title={!isOpen ? label : undefined}
    >
      <Icon
        className={cn(
          "w-5 h-5 shrink-0 transition-transform duration-200",
          isActive && "scale-110",
        )}
      />
      {isOpen && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

export const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="flex items-center justify-between px-4 h-16 bg-surface-900/80 backdrop-blur-md border-b border-surface-800 shrink-0 sticky top-0 z-30 shadow-sm w-full">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 text-surface-300 hover:text-white hover:bg-surface-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Link to="/" className="flex items-center gap-3 group">
        <span className="font-bold text-surface-50 text-lg tracking-tight group-hover:text-brand-400 transition-colors">
          {APP_NAME}
        </span>
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-md shadow-brand-600/20 group-hover:bg-brand-500 transition-colors">
          <Zap className="w-4 h-4 text-white" />
        </div>
      </Link>
    </header>
  );
};

export const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  return (
    <aside
      className={cn(
        "flex flex-col bg-surface-900 border-r border-surface-800 transition-all duration-300 z-20 shrink-0 relative",
        isOpen ? "w-[240px]" : "w-[72px]"
      )}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-surface-800 border border-surface-700 text-surface-300 hover:text-white w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors shadow-sm"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-hide mt-4">
        {NAV.map((item) => (
          <NavItem key={item.path} {...item} isOpen={isOpen} />
        ))}
      </nav>

      <div className="p-3 border-t border-surface-800 bg-surface-900/50 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-800/50 transition-colors cursor-pointer group" title={!isOpen ? "Back to Landing" : undefined}>
          <div className="w-9 h-9 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Zap className="w-4 h-4 text-brand-400" />
          </div>
          {isOpen && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-surface-100 truncate group-hover:text-white transition-colors">
                Back to Landing
              </p>
              <p className="text-xs text-surface-500 truncate group-hover:text-surface-400 transition-colors">
                {APP_NAME} OS
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
};
