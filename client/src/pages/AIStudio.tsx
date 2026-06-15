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
import { cn } from "../utils";
import { CHANNEL_LABELS } from "../constants";

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

  const handleCopilot = async () => {
    if (!copilotSegId || !brandCategory) {
      toast.error("Validation", "Select a segment and enter brand category");
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
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-400" />
          AI Studio
        </h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Powered by Gemini — generate messages, build audiences, and unlock
          insights
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Campaign Copilot */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="w-4 h-4 text-brand-400" />
            <h2 className="section-title">Campaign Copilot</h2>
          </div>
          <p className="text-xs text-surface-500">
            Generate audience-aware message variants in seconds
          </p>

          <div className="space-y-3">
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
            </div>
            <div>
              <label className="label">Channel</label>
              <div className="flex gap-2">
                {(["EMAIL", "SMS", "WHATSAPP"] as Channel[]).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setCopilotChannel(ch)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium border transition-all",
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
            </div>
            <button
              onClick={() => void handleCopilot()}
              className="btn-primary w-full"
              disabled={copilotLoading}
            >
              {copilotLoading ? (
                <>
                  <Spinner size="sm" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Variants
                </>
              )}
            </button>
          </div>

          {variants.length > 0 && (
            <div className="space-y-3 pt-2">
              {confidenceNote && (
                <div className="text-xs text-brand-400 bg-brand-400/5 border border-brand-400/20 rounded-lg p-3">
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
                    "border rounded-xl p-4 cursor-pointer transition-all",
                    TONE_COLORS[v.tone] ?? "border-surface-700 bg-surface-800",
                    selectedVariant === i ? "ring-1 ring-brand-500" : "",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-surface-300 uppercase tracking-wider">
                      {v.tone}
                    </span>
                    <CopyButton text={v.message} />
                  </div>
                  {v.subject && (
                    <p className="text-xs text-surface-500 mb-1">
                      Subject:{" "}
                      <span className="text-surface-300">{v.subject}</span>
                    </p>
                  )}
                  <p className="text-sm text-surface-200 leading-relaxed">
                    {v.message}
                  </p>
                  {selectedVariant === i && (
                    <p className="text-xs text-surface-500 mt-2 border-t border-surface-700 pt-2">
                      {v.reasoning}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audience Builder */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-brand-400" />
            <h2 className="section-title">AI Audience Builder</h2>
          </div>
          <p className="text-xs text-surface-500">
            Describe your audience in plain English and get filter rules
          </p>

          <div className="space-y-3">
            <div>
              <label className="label">Describe your audience</label>
              <textarea
                className="input-base resize-none"
                rows={4}
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
                <>
                  <Spinner size="sm" /> Building...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Build Audience
                </>
              )}
            </button>
          </div>

          {audienceResult && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <span className="text-sm text-green-400 font-medium">
                  Audience matched
                </span>
                <span className="text-xl font-bold text-surface-50">
                  {formatNumber(audienceResult.customerCount)}
                </span>
              </div>

              <div className="card p-4">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">
                  Explanation
                </p>
                <p className="text-sm text-surface-300">
                  {audienceResult.explanation}
                </p>
              </div>

              {audienceResult.warnings.length > 0 && (
                <div className="text-xs text-yellow-400 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
                  ⚠️ {audienceResult.warnings.join(". ")}
                </div>
              )}

              <div className="card p-4">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-3">
                  Filter Rules · {audienceResult.filterRules.operator}
                </p>
                <div className="space-y-2">
                  {audienceResult.filterRules.conditions.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-surface-400 font-medium">
                        {c.field}
                      </span>
                      <span className="text-xs bg-surface-700 text-surface-400 px-2 py-0.5 rounded">
                        {c.op}
                      </span>
                      <span className="text-surface-300 font-mono">
                        {String(c.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-surface-500">
                Suggested name:{" "}
                <span className="text-surface-300 font-medium">
                  {audienceResult.suggestedName}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
