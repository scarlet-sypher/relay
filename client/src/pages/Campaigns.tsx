import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Send, Plus, Rocket, ChevronUp, ChevronDown } from "lucide-react";
import { useCampaigns } from "../hooks/useCampaigns";
import { useSegments } from "../hooks/useSegments";
import { createCampaign, launchCampaign } from "../api/campaigns.api";
import { useToast } from "../contexts/ToastContext";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { EmptyState } from "../common/EmptyState";
import { SearchInput } from "../common/SearchInput";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmModal } from "../common/ConfirmModal";
import { formatRelativeTime, formatNumber } from "../utils";
import {
  CAMPAIGN_STATUS_COLORS,
  CHANNEL_LABELS,
  CHANNEL_COLORS,
} from "../constants";
import type { CreateCampaignPayload, Channel } from "../types/api.types";
import { cn } from "../utils";

const BLANK: CreateCampaignPayload = {
  name: "",
  segmentId: "",
  channel: "EMAIL",
  messageBody: "",
  subjectLine: "",
};

export const Campaigns = () => {
  const { campaigns, loading, error, refetch } = useCampaigns();
  const { segments } = useSegments();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateCampaignPayload>(BLANK);
  const [creating, setCreating] = useState(false);
  const [launchTarget, setLaunchTarget] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filteredAndSorted = useMemo(() => {
    let result = campaigns.filter((c) => {
      const searchStr = `${c.name} ${c.status} ${c.channel} ${c.segment?.name ?? ""}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof typeof a];
        let bVal: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key === "segment") {
          aVal = a.segment?.name ?? "";
          bVal = b.segment?.name ?? "";
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [campaigns, search, sortConfig]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCreate = async () => {
    if (!form.name || !form.segmentId || !form.messageBody) {
      toast.error("Validation Error", "Name, segment and message are required");
      return;
    }
    setCreating(true);
    try {
      await createCampaign(form);
      toast.success("Campaign created", form.name);
      setShowCreate(false);
      setForm(BLANK);
      void refetch();
    } catch (e) {
      toast.error("Failed", e instanceof Error ? e.message : undefined);
    } finally {
      setCreating(false);
    }
  };

  const handleLaunch = async () => {
    if (!launchTarget) return;
    setLaunching(true);
    try {
      const res = await launchCampaign(launchTarget);
      toast.success(
        "Campaign launched",
        `${res.data.communicationCount} messages dispatched`,
      );
      setLaunchTarget(null);
      void refetch();
    } catch (e) {
      toast.error("Launch failed", e instanceof Error ? e.message : undefined);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="text-[13px] text-surface-500 mt-0.5">
            {campaigns.length} campaigns total
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-3.5 h-3.5" /> New Campaign
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-surface-800">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search campaigns..."
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <PageLoader />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filteredAndSorted.length === 0 ? (
          <EmptyState
            icon={<Send className="w-7 h-7" />}
            title="No campaigns yet"
            description={search ? "No campaigns match your search criteria" : "Create your first campaign to reach your audience"}
          />
        ) : (
          <>
            <div className="flex items-center gap-4 px-4 py-2 bg-surface-900/50 text-[11px] font-medium text-surface-500 uppercase tracking-wider border-b border-surface-800">
              <div className="flex-1 cursor-pointer select-none hover:text-white flex items-center gap-1" onClick={() => handleSort("name")}>
                Campaign
                {sortConfig?.key === "name" ? (
                  sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3 text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-400" />
                ) : (
                  <div className="flex flex-col -space-y-1 opacity-20"><ChevronUp className="w-2.5 h-2.5" /><ChevronDown className="w-2.5 h-2.5" /></div>
                )}
              </div>
              <div className="w-32 cursor-pointer select-none hover:text-white flex items-center gap-1 justify-end ml-4" onClick={() => handleSort("status")}>
                Status
                {sortConfig?.key === "status" ? (
                  sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3 text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-400" />
                ) : (
                  <div className="flex flex-col -space-y-1 opacity-20"><ChevronUp className="w-2.5 h-2.5" /><ChevronDown className="w-2.5 h-2.5" /></div>
                )}
              </div>
              <div className="w-24 cursor-pointer select-none hover:text-white flex items-center gap-1 justify-end hidden sm:flex" onClick={() => handleSort("createdAt")}>
                Created
                {sortConfig?.key === "createdAt" ? (
                  sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3 text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-400" />
                ) : (
                  <div className="flex flex-col -space-y-1 opacity-20"><ChevronUp className="w-2.5 h-2.5" /><ChevronDown className="w-2.5 h-2.5" /></div>
                )}
              </div>
              <div className="w-20 hidden md:block"></div>
            </div>
            <div className="divide-y divide-surface-800">
              {filteredAndSorted.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 p-3 hover:bg-surface-800/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        to={`/campaigns/${c.id}`}
                        className="font-medium text-[13px] text-surface-100 hover:text-white truncate"
                      >
                        {c.name}
                      </Link>
                      <div className="scale-90 origin-left flex items-center gap-2">
                        <StatusBadge
                          label={c.status}
                          colorClass={CAMPAIGN_STATUS_COLORS[c.status] ?? ""}
                        />
                        <StatusBadge
                          label={CHANNEL_LABELS[c.channel] ?? c.channel}
                          colorClass={CHANNEL_COLORS[c.channel] ?? ""}
                          dot={false}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[11px] text-surface-500">
                        {c.segment?.name ?? "—"}
                      </span>
                      <span className="text-[11px] text-surface-600">
                        {formatRelativeTime(c.createdAt)}
                      </span>
                      {c.analytics && (
                        <span className="text-[11px] text-surface-500">
                          {formatNumber(c.analytics.totalSent)} sent ·{" "}
                          {c.analytics.deliveryRate}% delivered
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.status === "DRAFT" && (
                      <button
                        onClick={() => setLaunchTarget(c.id)}
                        className="btn-primary text-[11px] py-1.5 px-3"
                      >
                        <Rocket className="w-3.5 h-3.5" /> Launch
                      </button>
                    )}
                    <Link
                      to={`/campaigns/${c.id}`}
                      className="btn-ghost text-[11px] py-1.5 px-3"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative card p-6 w-full max-w-lg shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto">
            <h2 className="section-title mb-5">Create Campaign</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Campaign Name *</label>
                <input
                  className="input-base"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Win-Back: Inactive Customers"
                />
              </div>
              <div>
                <label className="label">Audience Segment *</label>
                <select
                  className="input-base"
                  value={form.segmentId}
                  onChange={(e) =>
                    setForm({ ...form, segmentId: e.target.value })
                  }
                >
                  <option value="">Select a segment...</option>
                  {segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.customerCount} customers)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Channel *</label>
                <div className="flex gap-2">
                  {(["EMAIL", "SMS", "WHATSAPP"] as Channel[]).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setForm({ ...form, channel: ch })}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
                        form.channel === ch
                          ? "bg-brand-600 border-brand-600 text-white"
                          : "bg-surface-800 border-surface-700 text-surface-400 hover:text-surface-200",
                      )}
                    >
                      {CHANNEL_LABELS[ch]}
                    </button>
                  ))}
                </div>
              </div>
              {form.channel === "EMAIL" && (
                <div>
                  <label className="label">Subject Line</label>
                  <input
                    className="input-base"
                    value={form.subjectLine ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, subjectLine: e.target.value })
                    }
                    placeholder="We miss you!"
                  />
                </div>
              )}
              <div>
                <label className="label">Message Body *</label>
                <textarea
                  className="input-base resize-none"
                  rows={4}
                  value={form.messageBody}
                  onChange={(e) =>
                    setForm({ ...form, messageBody: e.target.value })
                  }
                  placeholder="Hi [First Name], we've been thinking about you..."
                />
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-surface-500 font-medium uppercase tracking-wider mr-1">Insert Tag:</span>
                  {[
                    { id: "[First Name]", label: "First Name" },
                    { id: "[Last Order Date]", label: "Last Order Date" },
                    { id: "[Favorite Category]", label: "Favorite Category" },
                  ].map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, messageBody: form.messageBody + tag.id })
                      }
                      className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
                    >
                      + {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setShowCreate(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreate()}
                className="btn-primary"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!launchTarget}
        title="Launch Campaign"
        message="This will immediately dispatch messages to all customers in the segment. This action cannot be undone."
        confirmLabel="Launch Now"
        variant="primary"
        onConfirm={() => void handleLaunch()}
        onCancel={() => setLaunchTarget(null)}
        loading={launching}
      />
    </div>
  );
};
