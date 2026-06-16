import { useState } from "react";
import {
  Users,
  Send,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCustomers } from "../hooks/useCustomers";
import { useCampaigns } from "../hooks/useCampaigns";
import { useSegments } from "../hooks/useSegments";
import { useAnalytics } from "../hooks/useAnalytics";
import { SkeletonCard } from "../common/SkeletonRow";
import {
  formatCurrency,
  formatNumber,
  formatRelativeTime,
  formatPercent,
} from "../utils";
import { CAMPAIGN_STATUS_COLORS, CHANNEL_LABELS } from "../constants";
import { StatusBadge } from "../common/StatusBadge";
// import { cn } from "../utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}

const KpiCard = ({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  loading,
}: KpiCardProps) => {
  if (loading) return <SkeletonCard />;
  return (
    <div className="card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-surface-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-brand-600/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-brand-400" />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold text-surface-50">{value}</p>
        {sub && (
          <div className="flex items-center gap-1 mt-0.5">
            {trend === "up" && (
              <TrendingUp className="w-3 h-3 text-green-400" />
            )}
            {trend === "down" && (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
            <p className="text-[11px] text-surface-500">{sub}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const {
    customers,
    total: totalCustomers,
    loading: cLoading,
  } = useCustomers(1, 5);
  const { campaigns, loading: campLoading } = useCampaigns();
  const { segments, loading: segLoading } = useSegments();
  const { analytics, loading: aLoading } = useAnalytics();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // const loading = cLoading || campLoading || segLoading || aLoading;

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "SENDING" || c.status === "COMPLETING",
  ).length;

  const completedCampaigns = campaigns.filter((c) => c.status === "COMPLETED");

  const avgDeliveryRate =
    analytics.length > 0
      ? analytics.reduce((sum, a) => sum + parseFloat(a.deliveryRate), 0) /
        analytics.length
      : 0;

  const totalMessagesSent = analytics.reduce((sum, a) => sum + a.totalSent, 0);

  const chartData = completedCampaigns.slice(-7).map((c) => ({
    name: c.name.slice(0, 12),
    sent: c.analytics?.totalSent ?? 0,
    delivered: c.analytics?.totalDelivered ?? 0,
    clicked: c.analytics?.totalClicked ?? 0,
  }));

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-[13px] text-surface-500 mt-0.5">
            Welcome back. Here's what's happening.
          </p>
        </div>
        <button
          onClick={() => setLastRefresh(new Date())}
          className="btn-ghost text-[11px]"
        >
          <RefreshCw className="w-3 h-3" />
          Refreshed {formatRelativeTime(lastRefresh.toISOString())}
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Customers"
          value={formatNumber(totalCustomers)}
          sub="in your database"
          icon={Users}
          loading={cLoading}
        />
        <KpiCard
          label="Active Campaigns"
          value={activeCampaigns}
          sub={`${campaigns.length} total campaigns`}
          icon={Send}
          trend="up"
          loading={campLoading}
        />
        <KpiCard
          label="Audience Segments"
          value={segments.length}
          sub="saved segments"
          icon={Filter}
          loading={segLoading}
        />
        <KpiCard
          label="Avg Delivery Rate"
          value={formatPercent(avgDeliveryRate)}
          sub={`${formatNumber(totalMessagesSent)} messages sent`}
          icon={BarChart3}
          trend={avgDeliveryRate >= 80 ? "up" : "down"}
          loading={aLoading}
        />
      </div>

      {/* Chart + Recent Campaigns */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Campaign Performance</h2>
              <p className="text-[11px] text-surface-500 mt-0.5">
                Last 7 completed campaigns
              </p>
            </div>
          </div>
          {chartData.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-[13px] text-surface-600">
                No completed campaigns yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="delivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stroke="#6366f1"
                  fill="url(#sent)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stroke="#34d399"
                  fill="url(#delivered)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Campaigns */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Recent Campaigns</h2>
            <Link
              to="/campaigns"
              className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {campLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg shimmer-bg" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <p className="text-[13px] text-surface-600 text-center py-6">
              No campaigns yet
            </p>
          ) : (
            <div className="space-y-1">
              {campaigns.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  to={`/campaigns/${c.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-800 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-surface-200 truncate group-hover:text-white">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-surface-500">
                      {CHANNEL_LABELS[c.channel]}
                    </p>
                  </div>
                  <div className="scale-90">
                    <StatusBadge
                      label={c.status}
                      colorClass={CAMPAIGN_STATUS_COLORS[c.status] ?? ""}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Customers */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Recent Customers</h2>
            <Link
              to="/customers"
              className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {cLoading ? (
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded shimmer-bg" />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              {customers.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  to={`/customers/${c.id}`}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600/20 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-brand-400">
                      {c.firstName[0]}
                      {c.lastName[0]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-surface-200 truncate">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-[11px] text-surface-500 truncate">
                      {c.email}
                    </p>
                  </div>
                  <span className="text-[11px] text-surface-500 shrink-0">
                    {formatCurrency(c.totalSpend)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Segments */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Audience Segments</h2>
            <Link
              to="/segments"
              className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {segLoading ? (
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded shimmer-bg" />
              ))}
            </div>
          ) : segments.length === 0 ? (
            <p className="text-[13px] text-surface-600 text-center py-6">
              No segments yet
            </p>
          ) : (
            <div className="space-y-1">
              {segments.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  to={`/segments/${s.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-800 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-surface-200 truncate">
                      {s.name}
                    </p>
                    <p className="text-[11px] text-surface-500">
                      {s.description ?? "No description"}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-[13px] font-semibold text-surface-100">
                      {formatNumber(s.customerCount)}
                    </p>
                    <p className="text-[11px] text-surface-600">customers</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
