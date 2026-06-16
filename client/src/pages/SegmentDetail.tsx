import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Filter } from "lucide-react";
import { useSegment } from "../hooks/useSegments";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { formatDate, formatNumber } from "../utils";
import { FILTER_OP_LABELS } from "../constants";

export const SegmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { segment, loading, error } = useSegment(id ?? "");

  if (loading) return <PageLoader />;
  if (error || !segment)
    return <ErrorState message={error ?? "Segment not found"} />;

  const rules = segment.filterRules;

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <Link to="/segments" className="btn-ghost p-1.5">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title">{segment.name}</h1>
          <p className="text-[11px] text-surface-500 mt-0.5">Segment Details</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-surface-50 truncate">
                  {formatNumber(segment.customerCount)}
                </p>
                <p className="text-[11px] text-surface-500 truncate">customers match</p>
              </div>
            </div>
            <div className="divider" />
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-surface-500">Created</span>
                <span className="text-surface-300 font-medium">
                  {formatDate(segment.createdAt)}
                </span>
              </div>
              {segment.lastUsedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-surface-500">Last used</span>
                  <span className="text-surface-300 font-medium">
                    {formatDate(segment.lastUsedAt)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-surface-500">Source</span>
                <span className="text-surface-300 font-medium">
                  {segment.isAiDiscovered ? "AI Generated" : "Manual"}
                </span>
              </div>
            </div>
          </div>

          {segment.description && (
            <div className="card p-4">
              <h3 className="text-[11px] font-medium text-surface-500 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-[13px] text-surface-300">{segment.description}</p>
            </div>
          )}

          {segment.nlQuery && (
            <div className="card p-4">
              <h3 className="text-[11px] font-medium text-surface-500 uppercase tracking-wider mb-2">
                Natural Language Query
              </h3>
              <p className="text-[13px] text-surface-300 italic">
                "{segment.nlQuery}"
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="card p-4">
            <h3 className="section-title mb-3">Filter Rules</h3>
            <div className="space-y-2">
              <div className="text-[11px] font-medium text-surface-500 uppercase tracking-wider mb-2.5">
                Match {rules.operator === "AND" ? "ALL" : "ANY"} of these
                conditions
              </div>
              {rules.conditions.map((cond, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 bg-surface-800 rounded-lg border border-[#252d3e]"
                >
                  <Filter className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="text-[13px] font-medium text-surface-200">
                    {cond.field}
                  </span>
                  <span className="text-[11px] text-surface-400 bg-surface-900 border border-[#252d3e] px-1.5 py-0.5 rounded">
                    {FILTER_OP_LABELS[cond.op] ?? cond.op}
                  </span>
                  <span className="text-[13px] text-surface-300 font-mono">
                    {String(cond.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
