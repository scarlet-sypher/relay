import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Filter, Calendar } from "lucide-react";
import { useSegment } from "../hooks/useSegments";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { formatDate, formatNumber } from "../utils";

export const SegmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { segment, loading, error } = useSegment(id ?? "");

  if (loading) return <PageLoader />;
  if (error || !segment)
    return <ErrorState message={error ?? "Segment not found"} />;

  const rules = segment.filterRules;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/segments" className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title">{segment.name}</h1>
          <p className="text-sm text-surface-500">Segment Details</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-50">
                  {formatNumber(segment.customerCount)}
                </p>
                <p className="text-xs text-surface-500">customers match</p>
              </div>
            </div>
            <div className="divider" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-500">Created</span>
                <span className="text-surface-300">
                  {formatDate(segment.createdAt)}
                </span>
              </div>
              {segment.lastUsedAt && (
                <div className="flex justify-between">
                  <span className="text-surface-500">Last used</span>
                  <span className="text-surface-300">
                    {formatDate(segment.lastUsedAt)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-surface-500">Source</span>
                <span className="text-surface-300">
                  {segment.isAiDiscovered ? "AI Generated" : "Manual"}
                </span>
              </div>
            </div>
          </div>

          {segment.description && (
            <div className="card p-5">
              <h3 className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-sm text-surface-300">{segment.description}</p>
            </div>
          )}

          {segment.nlQuery && (
            <div className="card p-5">
              <h3 className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">
                Natural Language Query
              </h3>
              <p className="text-sm text-surface-300 italic">
                "{segment.nlQuery}"
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="card p-5">
            <h3 className="section-title mb-4">Filter Rules</h3>
            <div className="space-y-2">
              <div className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-3">
                Match {rules.operator === "AND" ? "ALL" : "ANY"} of these
                conditions
              </div>
              {rules.conditions.map((cond, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-surface-800 rounded-lg"
                >
                  <Filter className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="text-sm font-medium text-surface-200">
                    {cond.field}
                  </span>
                  <span className="text-xs text-surface-500 bg-surface-700 px-2 py-0.5 rounded">
                    {cond.op}
                  </span>
                  <span className="text-sm text-surface-300 font-mono">
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
