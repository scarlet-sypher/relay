import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Filter, Plus, Users, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { useSegments } from "../hooks/useSegments";
import {
  createSegment,
  previewSegment,
  buildSegmentFromNL,
} from "../api/segments.api";
import { useToast } from "../contexts/ToastContext";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { EmptyState } from "../common/EmptyState";
import { SearchInput } from "../common/SearchInput";
import { Spinner } from "../common/Spinner";
import { formatDate, formatNumber } from "../utils";
import { SEGMENT_FILTER_FIELDS, SEGMENT_FILTER_OPS } from "../constants";
import type { FilterRules, FilterCondition } from "../types/api.types";
import { cn } from "../utils";

type Mode = "manual" | "ai";

const blankCondition = (): FilterCondition => ({
  field: "totalSpend",
  op: "gte",
  value: 0,
});

export const Segments = () => {
  const { segments, loading, error, refetch } = useSegments();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [mode, setMode] = useState<Mode>("ai");

  // Manual form
  const [segName, setSegName] = useState("");
  const [segDesc, setSegDesc] = useState("");
  const [operator, setOperator] = useState<"AND" | "OR">("AND");
  const [conditions, setConditions] = useState<FilterCondition[]>([
    blankCondition(),
  ]);
  const [previewData, setPreviewData] = useState<{ count: number } | null>(
    null,
  );
  const [previewing, setPreviewing] = useState(false);

  // AI form
  const [nlQuery, setNlQuery] = useState("");
  const [nlResult, setNlResult] = useState<{
    filterRules: FilterRules;
    suggestedName: string;
    explanation: string;
    customerCount: number;
    warnings: string[];
  } | null>(null);
  const [nlLoading, setNlLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filteredAndSorted = useMemo(() => {
    let result = segments.filter((s) => {
      const searchStr = `${s.name} ${s.description ?? ""} ${s.nlQuery ?? ""}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof typeof a];
        let bVal: any = b[sortConfig.key as keyof typeof b];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [segments, search, sortConfig]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePreview = async () => {
    const rules: FilterRules = { operator, conditions };
    setPreviewing(true);
    try {
      const res = await previewSegment(rules);
      setPreviewData({ count: res.data.count });
    } catch (e) {
      toast.error("Preview failed", e instanceof Error ? e.message : undefined);
    } finally {
      setPreviewing(false);
    }
  };

  const handleNL = async () => {
    if (!nlQuery.trim()) return;
    setNlLoading(true);
    setNlResult(null);
    try {
      const res = await buildSegmentFromNL(nlQuery);
      setNlResult(res.data);
      setSegName(res.data.suggestedName);
    } catch (e) {
      toast.error("AI failed", e instanceof Error ? e.message : undefined);
    } finally {
      setNlLoading(false);
    }
  };

  const handleSave = async () => {
    const rules: FilterRules =
      mode === "ai" && nlResult
        ? (nlResult.filterRules as FilterRules)
        : { operator, conditions };

    if (!segName) {
      toast.error("Name required");
      return;
    }

    setSaving(true);
    try {
      await createSegment({
        name: segName,
        description: segDesc || undefined,
        filterRules: rules,
        nlQuery: mode === "ai" ? nlQuery : undefined,
      });
      toast.success("Segment created", segName);
      setShowCreate(false);
      resetForm();
      void refetch();
    } catch (e) {
      toast.error(
        "Failed to create segment",
        e instanceof Error ? e.message : undefined,
      );
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSegName("");
    setSegDesc("");
    setNlQuery("");
    setNlResult(null);
    setConditions([blankCondition()]);
    setPreviewData(null);
  };

  const updateCondition = (
    i: number,
    key: keyof FilterCondition,
    val: unknown,
  ) => {
    setConditions((prev) => {
      const next = [...prev];
      next[i] = { ...next[i]!, [key]: val } as FilterCondition;
      return next;
    });
  };

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Segments</h1>
          <p className="text-[13px] text-surface-500 mt-0.5">
            {segments.length} audience segments
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-3.5 h-3.5" /> New Segment
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-surface-800">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search segments..."
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <PageLoader />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filteredAndSorted.length === 0 ? (
          <EmptyState
            icon={<Filter className="w-7 h-7" />}
            title="No segments yet"
            description={search ? "No segments match your search criteria" : "Create audience segments to target your campaigns"}
          />
        ) : (
          <>
            <div className="flex items-center gap-4 px-4 py-2 bg-surface-900/50 text-[11px] font-medium text-surface-500 uppercase tracking-wider border-b border-surface-800">
              <div className="flex-1 cursor-pointer select-none hover:text-white flex items-center gap-1" onClick={() => handleSort("name")}>
                Segment Name
                {sortConfig?.key === "name" ? (
                  sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3 text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-400" />
                ) : (
                  <div className="flex flex-col -space-y-1 opacity-20"><ChevronUp className="w-2.5 h-2.5" /><ChevronDown className="w-2.5 h-2.5" /></div>
                )}
              </div>
              <div className="w-32 cursor-pointer select-none hover:text-white flex items-center gap-1 justify-end ml-4" onClick={() => handleSort("customerCount")}>
                Customers
                {sortConfig?.key === "customerCount" ? (
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
            </div>
            <div className="divide-y divide-surface-800">
              {filteredAndSorted.map((s) => (
                <Link
                  key={s.id}
                  to={`/segments/${s.id}`}
                  className="flex items-center justify-between p-3 hover:bg-surface-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-brand-600/10 flex items-center justify-center shrink-0">
                      <Filter className="w-3.5 h-3.5 text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[13px] text-surface-100 group-hover:text-white truncate">
                        {s.name}
                      </p>
                      <p className="text-[11px] text-surface-500 truncate mt-0.5">
                        {s.description ??
                          (s.nlQuery ? `"${s.nlQuery}"` : "Manual filter")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0 ml-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[13px] font-semibold text-surface-100">
                        <Users className="w-3 h-3 text-surface-500" />
                        {formatNumber(s.customerCount)}
                      </div>
                      <p className="text-[11px] text-surface-600">customers</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] text-surface-500">
                        {formatDate(s.createdAt)}
                      </p>
                      {s.isAiDiscovered && (
                        <span className="text-2xs text-brand-400 flex items-center gap-0.5 justify-end">
                          <Sparkles className="w-3 h-3" /> AI
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
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
            onClick={() => {
              setShowCreate(false);
              resetForm();
            }}
          />
          <div className="relative card p-6 w-full max-w-2xl shadow-modal animate-slide-up max-h-[90vh] overflow-y-auto">
            <h2 className="section-title mb-2">Create Segment</h2>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-5 p-1 bg-surface-800 rounded-lg w-fit">
              {(["ai", "manual"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                    mode === m
                      ? "bg-surface-700 text-surface-100"
                      : "text-surface-500 hover:text-surface-300",
                  )}
                >
                  {m === "ai" ? "✦ AI Builder" : "Manual Filters"}
                </button>
              ))}
            </div>

            {mode === "ai" ? (
              <div className="space-y-4">
                <div>
                  <label className="label">Describe your audience</label>
                  <textarea
                    className="input-base resize-none"
                    rows={3}
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                    placeholder="e.g. Customers who spent over ₹2000 in the last 3 months but haven't ordered in 30 days"
                  />
                </div>
                <button
                  onClick={() => void handleNL()}
                  className="btn-primary"
                  disabled={nlLoading || !nlQuery.trim()}
                >
                  {nlLoading ? (
                    <>
                      <Spinner size="sm" /> Building...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Build with AI
                    </>
                  )}
                </button>

                {nlResult && (
                  <div className="card p-4 space-y-3 border-brand-600/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-400">
                        AI Result
                      </span>
                      <span className="text-sm font-bold text-surface-100">
                        {formatNumber(nlResult.customerCount)} customers
                      </span>
                    </div>
                    <p className="text-sm text-surface-400">
                      {nlResult.explanation}
                    </p>
                    {nlResult.warnings.length > 0 && (
                      <div className="text-xs text-yellow-400 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
                        {nlResult.warnings.join(". ")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-surface-400">Match</span>
                  <select
                    className="input-base w-auto"
                    value={operator}
                    onChange={(e) =>
                      setOperator(e.target.value as "AND" | "OR")
                    }
                  >
                    <option value="AND">ALL conditions</option>
                    <option value="OR">ANY condition</option>
                  </select>
                </div>
                {conditions.map((cond, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      className="input-base flex-1"
                      value={cond.field}
                      onChange={(e) =>
                        updateCondition(i, "field", e.target.value)
                      }
                    >
                      {SEGMENT_FILTER_FIELDS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="input-base flex-1"
                      value={cond.op}
                      onChange={(e) => updateCondition(i, "op", e.target.value)}
                    >
                      {SEGMENT_FILTER_OPS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input-base w-28"
                      value={String(cond.value)}
                      onChange={(e) =>
                        updateCondition(
                          i,
                          "value",
                          Number(e.target.value) || e.target.value,
                        )
                      }
                      placeholder="Value"
                    />
                    <button
                      onClick={() =>
                        setConditions((p) => p.filter((_, j) => j !== i))
                      }
                      className="btn-ghost text-red-400 hover:text-red-300 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setConditions((p) => [...p, blankCondition()])
                    }
                    className="btn-ghost text-xs"
                  >
                    + Add condition
                  </button>
                  <button
                    onClick={() => void handlePreview()}
                    className="btn-secondary text-xs"
                    disabled={previewing}
                  >
                    {previewing ? "Previewing..." : "Preview"}
                  </button>
                  {previewData && (
                    <span className="text-sm text-surface-300">
                      {formatNumber(previewData.count)} customers match
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="divider my-5" />
            <div className="space-y-3">
              <div>
                <label className="label">Segment Name *</label>
                <input
                  className="input-base"
                  value={segName}
                  onChange={(e) => setSegName(e.target.value)}
                  placeholder="High-Value Inactive Customers"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <input
                  className="input-base"
                  value={segDesc}
                  onChange={(e) => setSegDesc(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button
                onClick={() => {
                  setShowCreate(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSave()}
                className="btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Segment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
