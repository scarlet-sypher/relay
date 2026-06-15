import { useState, useEffect, useCallback } from "react";
import { getSegments, getSegmentById } from "../api/segments.api";
import type { Segment } from "../types/api.types";

export const useSegments = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSegments();
      setSegments(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load segments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { segments, loading, error, refetch: fetch };
};

export const useSegment = (id: string) => {
  const [segment, setSegment] = useState<Segment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSegmentById(id)
      .then((res) => setSegment(res.data))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return { segment, loading, error };
};
