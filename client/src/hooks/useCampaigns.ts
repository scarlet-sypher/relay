import { useState, useEffect, useCallback, useRef } from "react";
import { getCampaigns, getCampaignById } from "../api/campaigns.api";
import type { Campaign } from "../types/api.types";
import { POLL_INTERVAL_MS } from "../constants";

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { campaigns, loading, error, refetch: fetch };
};

export const useCampaign = (id: string) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async () => {
    try {
      const res = await getCampaignById(id);
      setCampaign(res.data);
      return res.data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load campaign");
      return null;
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    void fetch().finally(() => setLoading(false));
  }, [fetch]);

  useEffect(() => {
    if (!campaign) return;

    const isSending =
      campaign.status === "SENDING" || campaign.status === "COMPLETING";

    if (isSending) {
      intervalRef.current = setInterval(() => {
        void fetch();
      }, POLL_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [campaign, fetch]);

  return { campaign, loading, error, refetch: fetch };
};
