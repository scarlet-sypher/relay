import { useState, useEffect, useCallback } from "react";
import { getAllAnalytics } from "../api/analytics.api";
import type { AnalyticsWithCampaign } from "../types/api.types";

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllAnalytics();
      setAnalytics(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { analytics, loading, error, refetch: fetch };
};
