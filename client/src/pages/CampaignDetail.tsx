import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Rocket,
  CheckCircle,
  XCircle,
  MousePointer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useCampaign } from "../hooks/useCampaigns";
import { launchCampaign } from "../api/campaigns.api";
import { useToast } from "../contexts/ToastContext";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmModal } from "../common/ConfirmModal";
import { useState } from "react";
import {
  formatDateTime,
  formatRelativeTime,
  formatPercent,
  formatNumber,
} from "../utils";
import {
  CAMPAIGN_STATUS_COLORS,
  CHANNEL_COLORS,
  CHANNEL_LABELS,
  COMMUNICATION_STATUS_COLORS,
} from "../constants";

const FUNNEL_COLORS = ["#6366f1", "#34d399", "#fbbf24", "#f97316", "#ec4899"];

export const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { campaign, loading, error, refetch } = useCampaign(id ?? "");
  const toast = useToast();
  const [launching, setLaunching] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);

  const handleLaunch = async () => {
    if (!campaign) return;
    setLaunching(true);
    try {
      const res = await launchCampaign(campaign.id);
      toast.success(
        "Launched",
        `${res.data.communicationCount} messages dispatched`,
      );
      setShowLaunch(false);
      void refetch();
    } catch (e) {
      toast.error("Launch failed", e instanceof Error ? e.message : undefined);
    } finally {
      setLaunching(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error || !campaign)
    return (
      <ErrorState
        message={error ?? "Campaign not found"}
        onRetry={() => void refetch()}
      />
    );

  const a = campaign.analytics;
  const isSending =
    campaign.status === "SENDING" || campaign.status === "COMPLETING";

  const funnelData = a
    ? [
        { name: "Sent", value: a.totalSent },
        { name: "Delivered", value: a.totalDelivered },
        { name: "Opened", value: a.totalOpened },
        { name: "Read", value: a.totalRead },
        { name: "Clicked", value: a.totalClicked },
      ]
    : [];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/campaigns" className="btn-ghost">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title">{campaign.name}</h1>
              <StatusBadge
                label={campaign.status}
                colorClass={CAMPAIGN_STATUS_COLORS[campaign.status] ?? ""}
              />
              {isSending && (
                <span className="flex items-center gap-1.5 text-xs text-brand-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <p className="text-sm text-surface-500 mt-0.5">
              Created {formatRelativeTime(campaign.createdAt)}
            </p>
          </div>
        </div>
        {campaign.status === "DRAFT" && (
          <button onClick={() => setShowLaunch(true)} className="btn-primary">
            <Rocket className="w-4 h-4" /> Launch Campaign
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Meta */}
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="text-xs font-medium text-surface-500 uppercase tracking-wider">
              Campaign Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-500">Channel</span>
                <StatusBadge
                  label={CHANNEL_LABELS[campaign.channel] ?? campaign.channel}
                  colorClass={CHANNEL_COLORS[campaign.channel] ?? ""}
                  dot={false}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Segment</span>
                <span className="text-surface-300">
                  {campaign.segment?.name ?? "—"}
                </span>
              </div>
              {campaign.sentAt && (
                <div className="flex justify-between">
                  <span className="text-surface-500">Sent at</span>
                  <span className="text-surface-300">
                    {formatDateTime(campaign.sentAt)}
                  </span>
                </div>
              )}
              {campaign.completedAt && (
                <div className="flex justify-between">
                  <span className="text-surface-500">Completed</span>
                  <span className="text-surface-300">
                    {formatDateTime(campaign.completedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-3">
              Message
            </h3>
            {campaign.subjectLine && (
              <p className="text-xs text-surface-500 mb-1">
                Subject:{" "}
                <span className="text-surface-300">{campaign.subjectLine}</span>
              </p>
            )}
            <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap">
              {campaign.messageBody}
            </p>
          </div>

          {campaign.aiInsight && (
            <div className="card p-5 border-brand-600/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-brand-400">
                  ✦ AI Insight
                </span>
              </div>
              <p className="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap">
                {campaign.aiInsight}
              </p>
            </div>
          )}
        </div>

        {/* Right: Analytics + Communications */}
        <div className="lg:col-span-2 space-y-5">
          {/* Metric Cards */}
          {a && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Sent",
                    value: formatNumber(a.totalSent),
                    icon: Send,
                    color: "text-brand-400",
                  },
                  {
                    label: "Delivered",
                    value: formatNumber(a.totalDelivered),
                    icon: CheckCircle,
                    color: "text-green-400",
                  },
                  {
                    label: "Failed",
                    value: formatNumber(a.totalFailed),
                    icon: XCircle,
                    color: "text-red-400",
                  },
                  {
                    label: "Clicked",
                    value: formatNumber(a.totalClicked),
                    icon: MousePointer,
                    color: "text-yellow-400",
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-xs text-surface-500">{label}</span>
                    </div>
                    <p className="text-xl font-bold text-surface-50">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Delivery Rate",
                    value: formatPercent(a.deliveryRate),
                  },
                  { label: "Open Rate", value: formatPercent(a.openRate) },
                  { label: "Click Rate", value: formatPercent(a.clickRate) },
                ].map(({ label, value }) => (
                  <div key={label} className="card p-4 text-center">
                    <p className="text-2xl font-bold text-surface-50">
                      {value}
                    </p>
                    <p className="text-xs text-surface-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Funnel Chart */}
              <div className="card p-5">
                <h3 className="section-title mb-4">Engagement Funnel</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {funnelData.map((_, i) => (
                        <Cell key={i} fill={FUNNEL_COLORS[i] ?? "#6366f1"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Communication Log */}
          {campaign.communications && campaign.communications.length > 0 && (
            <div className="card">
              <div className="px-5 py-4 border-b border-surface-800 flex items-center justify-between">
                <h3 className="section-title">Communication Log</h3>
                <span className="text-xs text-surface-500">
                  {campaign.communications.length} recipients
                </span>
              </div>
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-surface-900">
                    <tr className="border-b border-surface-800">
                      {["Recipient", "Address", "Status", "Last Updated"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-2.5 text-xs font-medium text-surface-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800">
                    {campaign.communications.map((comm) => (
                      <tr
                        key={comm.id}
                        className="hover:bg-surface-800/40 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <span className="text-sm text-surface-200">
                            {comm.customer
                              ? `${comm.customer.firstName} ${comm.customer.lastName}`
                              : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-mono text-surface-400">
                            {comm.recipientAddress}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge
                            label={comm.status}
                            colorClass={
                              COMMUNICATION_STATUS_COLORS[comm.status] ?? ""
                            }
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs text-surface-500">
                            {formatRelativeTime(comm.updatedAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showLaunch}
        title="Launch Campaign"
        message="Messages will be dispatched immediately to all customers in the segment."
        confirmLabel="Launch Now"
        variant="primary"
        onConfirm={() => void handleLaunch()}
        onCancel={() => setShowLaunch(false)}
        loading={launching}
      />
    </div>
  );
};
