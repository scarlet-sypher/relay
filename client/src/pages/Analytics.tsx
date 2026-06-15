import { BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { EmptyState } from "../common/EmptyState";
import { StatusBadge } from "../common/StatusBadge";
import { formatPercent, formatNumber, formatDate, truncate } from "../utils";
import { CHANNEL_COLORS, CHANNEL_LABELS } from "../constants";

export const Analytics = () => {
  const { analytics, loading, error, refetch } = useAnalytics();

  if (loading)
    return (
      <div className="p-6">
        <PageLoader />
      </div>
    );
  if (error)
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  if (analytics.length === 0)
    return (
      <div className="p-6">
        <EmptyState
          icon={<BarChart3 className="w-7 h-7" />}
          title="No analytics yet"
          description="Launch campaigns to see performance data"
        />
      </div>
    );

  const chartData = analytics.slice(0, 10).map((a) => ({
    name: truncate(a.campaign.name, 14),
    delivery: parseFloat(a.deliveryRate),
    open: parseFloat(a.openRate),
    click: parseFloat(a.clickRate),
    sent: a.totalSent,
  }));

  const avgDelivery =
    analytics.reduce((s, a) => s + parseFloat(a.deliveryRate), 0) /
    analytics.length;
  const avgClick =
    analytics.reduce((s, a) => s + parseFloat(a.clickRate), 0) /
    analytics.length;
  const totalSent = analytics.reduce((s, a) => s + a.totalSent, 0);
  const totalClicks = analytics.reduce((s, a) => s + a.totalClicked, 0);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Performance across all campaigns
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Campaigns Tracked", value: analytics.length },
          { label: "Total Messages Sent", value: formatNumber(totalSent) },
          { label: "Avg Delivery Rate", value: formatPercent(avgDelivery) },
          { label: "Total Clicks", value: formatNumber(totalClicks) },
        ].map(({ label, value }) => (
          <div key={label} className="card p-5">
            <TrendingUp className="w-4 h-4 text-brand-400 mb-3" />
            <p className="text-2xl font-bold text-surface-50">{value}</p>
            <p className="text-xs text-surface-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="section-title mb-4">Delivery Rate by Campaign</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="delivery"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                name="Delivery %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-4">Rate Trends</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="delivery"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Delivery %"
              />
              <Line
                type="monotone"
                dataKey="open"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
                name="Open %"
              />
              <Line
                type="monotone"
                dataKey="click"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                name="Click %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="px-5 py-4 border-b border-surface-800">
          <h2 className="section-title">All Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800">
                {[
                  "Campaign",
                  "Channel",
                  "Sent",
                  "Delivered",
                  "Opened",
                  "Clicked",
                  "Delivery Rate",
                  "Click Rate",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {analytics.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-surface-800/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-surface-200">
                      {a.campaign.name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={
                        CHANNEL_LABELS[a.campaign.channel] ?? a.campaign.channel
                      }
                      colorClass={CHANNEL_COLORS[a.campaign.channel] ?? ""}
                      dot={false}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-300">
                    {formatNumber(a.totalSent)}
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-300">
                    {formatNumber(a.totalDelivered)}
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-300">
                    {formatNumber(a.totalOpened)}
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-300">
                    {formatNumber(a.totalClicked)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-green-400">
                      {formatPercent(a.deliveryRate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-yellow-400">
                      {formatPercent(a.clickRate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-500">
                    {formatDate(a.lastUpdatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
