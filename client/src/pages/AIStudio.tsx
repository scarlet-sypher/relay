import { useState } from "react";
import { Sparkles, Wand2, Users, Copy, Check } from "lucide-react";
import { useSegments } from "../hooks/useSegments";
import { generateMessage } from "../api/ai.api";
import { buildAudience } from "../api/ai.api";
import { useToast } from "../contexts/ToastContext";
import { Spinner } from "../common/Spinner";
import { formatNumber } from "../utils";
import type {
  Channel,
  MessageVariant,
  AudienceBuilderResponse,
} from "../types/api.types";
import { cn, isValidBrandCategory } from "../utils";
import { CHANNEL_LABELS, FILTER_OP_LABELS } from "../constants";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={() => void copy()} className="btn-ghost p-1.5">
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

const TONE_COLORS: Record<string, string> = {
  Direct: "border-blue-500/30 bg-blue-500/5",
  Warm: "border-green-500/30 bg-green-500/5",
  Playful: "border-yellow-500/30 bg-yellow-500/5",
};

export const AIStudio = () => {
  const { segments } = useSegments();
  const toast = useToast();

  // Copilot state
  const [copilotSegId, setCopilotSegId] = useState("");
  const [copilotChannel, setCopilotChannel] = useState<Channel>("WHATSAPP");
  const [brandCategory, setBrandCategory] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [variants, setVariants] = useState<MessageVariant[]>([]);
  const [confidenceNote, setConfidenceNote] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  // Audience builder state
  const [audienceQuery, setAudienceQuery] = useState("");
  const [audienceLoading, setAudienceLoading] = useState(false);
  const [audienceResult, setAudienceResult] =
    useState<AudienceBuilderResponse | null>(null);

  const [activeTab, setActiveTab] = useState<"copilot" | "audience" | null>(null);

  const selectedSegment = segments.find((s) => s.id === copilotSegId);
  const isSegmentValid =
    selectedSegment &&
    selectedSegment.customerCount > 0 &&
    selectedSegment.filterRules?.conditions?.length > 0;
  const isBrandValid = isValidBrandCategory(brandCategory);

  const handleCopilot = async () => {
    if (!isSegmentValid || !isBrandValid) {
      toast.error("Validation", "Please select a valid segment and brand category");
      return;
    }
    setCopilotLoading(true);
    setVariants([]);
    try {
      const res = await generateMessage({
        segmentId: copilotSegId,
        channel: copilotChannel,
        brandCategory,
      });
      setVariants(res.data.variants);
      setConfidenceNote(res.data.confidenceNote);
      toast.success("Message variants generated");
    } catch (e) {
      toast.error(
        "Generation failed",
        e instanceof Error ? e.message : undefined,
      );
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleAudience = async () => {
    if (!audienceQuery.trim()) return;
    setAudienceLoading(true);
    setAudienceResult(null);
    try {
      const res = await buildAudience(audienceQuery);
      setAudienceResult(res.data);
      toast.success(
        "Audience built",
        `${res.data.customerCount} customers match`,
      );
    } catch (e) {
      toast.error("Failed", e instanceof Error ? e.message : undefined);
    } finally {
      setAudienceLoading(false);
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          AI Studio
        </h1>
        <p className="text-[13px] text-surface-500 mt-0.5">
          Powered by AI: generate messages, build audiences, and unlock insights
        </p>
      </div>

      {/* Tab bar — full width pill style */}
      <div className="flex gap-1 p-1 bg-[#141920] border border-[#252d3e] rounded-xl w-full">
        <button
          onClick={() => setActiveTab("copilot")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
            activeTab === "copilot"
              ? "bg-[#1e2736] text-brand-400 border border-[#2e3d55]"
              : "text-surface-400 hover:text-surface-200 hover:bg-[#1a2030]",
          )}
        >
          <Wand2 className="w-4 h-4" />
          Campaign Copilot
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-semibold tracking-wide transition-colors",
              activeTab === "copilot"
                ? "bg-brand-500/20 text-brand-400"
                : "bg-surface-700/60 text-surface-500",
            )}
          >
            AI
          </span>
        </button>
        <button
          onClick={() => setActiveTab("audience")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
            activeTab === "audience"
              ? "bg-[#1e2736] text-brand-400 border border-[#2e3d55]"
              : "text-surface-400 hover:text-surface-200 hover:bg-[#1a2030]",
          )}
        >
          <Users className="w-4 h-4" />
          Audience Builder
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-semibold tracking-wide transition-colors",
              activeTab === "audience"
                ? "bg-brand-500/20 text-brand-400"
                : "bg-surface-700/60 text-surface-500",
            )}
          >
            AI
          </span>
        </button>
      </div>

      {/* Empty state */}
      {!activeTab && (
        <div className="card p-16 flex flex-col items-center justify-center text-center border-dashed border-[#252d3e] w-full">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-brand-400" />
          </div>
          <h2 className="text-lg font-medium text-surface-50 mb-2">Welcome to AI Studio</h2>
          <p className="text-[13px] text-surface-400 max-w-sm">
            Select a tab above to explore our AI-powered tools. Generate engaging campaign messages or build complex audience segments using plain English.
          </p>
        </div>
      )}

      {/* Tab content — full width, two-column on large screens */}
      {activeTab && (
        <div className="w-full animate-slide-up">

          {/* ── Campaign Copilot ── */}
          {activeTab === "copilot" && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-4">

              {/* Left: form */}
              <div className="card p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Wand2 className="w-4 h-4 text-brand-400" />
                    <h2 className="section-title">Campaign Copilot</h2>
                  </div>
                  <p className="text-[11px] text-surface-500">
                    Generate audience-aware message variants in seconds
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Segment</label>
                    <select
                      className="input-base"
                      value={copilotSegId}
                      onChange={(e) => setCopilotSegId(e.target.value)}
                    >
                      <option value="">Select segment...</option>
                      {segments.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.customerCount})
                        </option>
                      ))}
                    </select>
                    {copilotSegId && !isSegmentValid && (
                      <p className="text-[11px] text-red-400 mt-1.5 font-medium">
                        Please select a valid audience segment before generating campaign variants.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Channel</label>
                    <div className="flex gap-2">
                      {(["EMAIL", "SMS", "WHATSAPP"] as Channel[]).map((ch) => (
                        <button
                          key={ch}
                          onClick={() => setCopilotChannel(ch)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-[13px] font-medium border transition-all",
                            copilotChannel === ch
                              ? "bg-brand-600 border-brand-600 text-white"
                              : "bg-surface-800 border-surface-700 text-surface-400 hover:text-surface-200",
                          )}
                        >
                          {CHANNEL_LABELS[ch]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">Brand Category</label>
                    <input
                      className="input-base"
                      value={brandCategory}
                      onChange={(e) => setBrandCategory(e.target.value)}
                      placeholder="e.g. Skincare, Fashion, Food"
                    />
                    {brandCategory && !isBrandValid && (
                      <p className="text-[11px] text-red-400 mt-1.5 font-medium">
                        Please enter a valid brand category such as Fashion, Electronics, Beauty, Grocery, Home Decor, etc.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => void handleCopilot()}
                    className="btn-primary w-full"
                    disabled={copilotLoading || !copilotSegId || !brandCategory || !isSegmentValid || !isBrandValid}
                  >
                    {copilotLoading ? (
                      <><Spinner size="sm" /> Generating...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate Variants</>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: variants output */}
              <div className="card p-6">
                {variants.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-3">
                      <Sparkles className="w-5 h-5 text-brand-400/50" />
                    </div>
                    <p className="text-[13px] text-surface-500">
                      Fill in the form and hit{" "}
                      <span className="text-surface-300 font-medium">Generate Variants</span>{" "}
                      to see AI-crafted messages here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      <h2 className="section-title">Generated Variants</h2>
                    </div>
                    {confidenceNote && (
                      <div className="text-[11px] text-brand-400 bg-brand-400/5 border border-brand-400/20 rounded-lg p-2.5 mb-3">
                        ✦ {confidenceNote}
                      </div>
                    )}
                    {variants.map((v, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          setSelectedVariant(selectedVariant === i ? null : i)
                        }
                        className={cn(
                          "border rounded-xl p-3 cursor-pointer transition-all",
                          TONE_COLORS[v.tone] ?? "border-surface-700 bg-surface-800",
                          selectedVariant === i ? "ring-1 ring-brand-500" : "",
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-surface-300 uppercase tracking-wider">
                            {v.tone}
                          </span>
                          <CopyButton text={v.message} />
                        </div>
                        {v.subject && (
                          <p className="text-[11px] text-surface-500 mb-1">
                            Subject:{" "}
                            <span className="text-surface-300">{v.subject}</span>
                          </p>
                        )}
                        <p className="text-[13px] text-surface-200 leading-relaxed">
                          {v.message}
                        </p>
                        {selectedVariant === i && (
                          <p className="text-[11px] text-surface-500 mt-2 border-t border-[#252d3e] pt-2">
                            {v.reasoning}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Audience Builder ── */}
          {activeTab === "audience" && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-4">

              {/* Left: query input */}
              <div className="card p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-brand-400" />
                    <h2 className="section-title">AI Audience Builder</h2>
                  </div>
                  <p className="text-[11px] text-surface-500">
                    Describe your audience in plain English and get filter rules
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Describe your audience</label>
                    <textarea
                      className="input-base resize-none"
                      rows={6}
                      value={audienceQuery}
                      onChange={(e) => setAudienceQuery(e.target.value)}
                      placeholder="e.g. Customers who spent over ₹2000 in the last 3 months but haven't ordered in 30 days..."
                    />
                  </div>
                  <button
                    onClick={() => void handleAudience()}
                    className="btn-primary w-full"
                    disabled={audienceLoading || !audienceQuery.trim()}
                  >
                    {audienceLoading ? (
                      <><Spinner size="sm" /> Building...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Build Audience</>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: results */}
              <div className="card p-6">
                {!audienceResult ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-brand-400/50" />
                    </div>
                    <p className="text-[13px] text-surface-500">
                      Describe your audience and hit{" "}
                      <span className="text-surface-300 font-medium">Build Audience</span>{" "}
                      to see matched customers and filter rules here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-brand-400" />
                      <h2 className="section-title">Audience Results</h2>
                    </div>

                    {audienceResult.isValidAudience === false ? (
                      <div className="flex flex-col items-center justify-center p-4 bg-red-500/5 border border-red-500/20 rounded-lg text-center">
                        <span className="text-[13px] text-red-400 font-medium mb-1">
                          Could not understand the audience description.
                        </span>
                        <span className="text-[12px] text-surface-400">
                          {audienceResult.message}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                        <span className="text-[13px] text-green-400 font-medium">
                          Audience matched
                        </span>
                        <span className="text-xl font-bold text-surface-50">
                          {formatNumber(audienceResult.customerCount)}
                        </span>
                      </div>
                    )}

                    <div className="card p-3">
                      <p className="text-[11px] font-medium text-surface-500 uppercase tracking-wider mb-1.5">
                        Explanation
                      </p>
                      <p className="text-[13px] text-surface-300">
                        {audienceResult.explanation}
                      </p>
                    </div>

                    {audienceResult.warnings.length > 0 && (
                      <div className="text-[11px] text-yellow-400 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-2.5">
                        ⚠️ {audienceResult.warnings.join(". ")}
                      </div>
                    )}

                    {audienceResult.filterRules?.conditions?.length > 0 && (
                      <div className="card p-3">
                        <p className="text-[11px] font-medium text-surface-500 uppercase tracking-wider mb-2">
                          Filter Rules · {audienceResult.filterRules.operator}
                        </p>
                        <div className="space-y-1.5">
                          {audienceResult.filterRules.conditions.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 text-[13px]">
                              <span className="text-surface-400 font-medium">
                                {c.field}
                              </span>
                              <span className="text-[11px] bg-surface-800 border border-[#252d3e] text-surface-400 px-1.5 py-0.5 rounded">
                                {FILTER_OP_LABELS[c.op] ?? c.op}
                              </span>
                              <span className="text-surface-300 font-mono">
                                {String(c.value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-surface-500">
                      Suggested name:{" "}
                      <span className="text-surface-300 font-medium">
                        {audienceResult.suggestedName}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};