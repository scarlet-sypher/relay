import { useState, useEffect } from "react";
import { Activity, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { getHealth } from "../api/health.api";
import { formatDateTime } from "../utils";
import { Spinner } from "../common/Spinner";

interface ServiceStatus {
  name: string;
  url: string;
  status: "checking" | "online" | "offline";
  message?: string;
  timestamp?: string;
}

export const Health = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "CRM Service",
      url: import.meta.env["VITE_CRM_API_URL"] ?? "",
      status: "checking",
    },
  ]);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setChecking(true);
    setServices((prev) =>
      prev.map((s) => ({ ...s, status: "checking" as const })),
    );
    try {
      const res = await getHealth();
      setServices([
        {
          name: "CRM Service",
          url: import.meta.env["VITE_CRM_API_URL"] ?? "",
          status: "online",
          message: res.message,
          timestamp: res.data.timestamp,
        },
      ]);
    } catch {
      setServices([
        {
          name: "CRM Service",
          url: import.meta.env["VITE_CRM_API_URL"] ?? "",
          status: "offline",
          message: "Service unreachable",
        },
      ]);
    } finally {
      setChecking(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    void checkHealth();
  }, []);

  const allOnline = services.every((s) => s.status === "online");

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            System Health
          </h1>
          <p className="text-[13px] text-surface-500 mt-0.5">
            {lastChecked
              ? `Last checked ${lastChecked.toLocaleTimeString()}`
              : "Checking..."}
          </p>
        </div>
        <button
          onClick={() => void checkHealth()}
          className="btn-secondary"
          disabled={checking}
        >
          {checking ? <Spinner size="sm" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh
        </button>
      </div>

      {/* Overall status */}
      <div
        className={`card p-4 flex items-center gap-3 ${allOnline ? "border-green-500/20" : "border-red-500/20"}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${allOnline ? "bg-green-500/10" : "bg-red-500/10"}`}
        >
          {allOnline ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div>
          <p className="font-semibold text-surface-100 text-[13px]">
            {allOnline
              ? "All systems operational"
              : "Service degradation detected"}
          </p>
          <p className="text-[11px] text-surface-500 mt-0.5">
            {services.length} service{services.length !== 1 ? "s" : ""}{" "}
            monitored
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="card divide-y divide-[#252d3e]">
        {services.map((s) => (
          <div key={s.name} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  s.status === "online"
                    ? "bg-green-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                    : s.status === "offline"
                      ? "bg-red-400"
                      : "bg-yellow-400 animate-pulse"
                }`}
              />
              <div>
                <p className="font-medium text-[13px] text-surface-100">{s.name}</p>
                <p className="text-[11px] text-surface-500 font-mono mt-0.5">{s.url}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-[13px] font-medium ${
                  s.status === "online"
                    ? "text-green-400"
                    : s.status === "offline"
                      ? "text-red-400"
                      : "text-yellow-400"
                }`}
              >
                {s.status === "checking"
                  ? "Checking..."
                  : s.status.toUpperCase()}
              </p>
              {s.timestamp && (
                <p className="text-[11px] text-surface-500 mt-0.5">
                  {formatDateTime(s.timestamp)}
                </p>
              )}
              {s.message && s.status === "offline" && (
                <p className="text-[11px] text-red-400 mt-0.5">{s.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
