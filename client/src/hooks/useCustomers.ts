import { useState, useEffect, useCallback } from "react";
import { getCustomers, getCustomerById } from "../api/customers.api";
import type { Customer, CustomerWithInsight } from "../types/api.types";

export const useCustomers = (page = 1, limit = 20) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomers(page, limit);
      setCustomers(res.data.customers);
      setTotal(res.data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { customers, total, loading, error, refetch: fetch };
};

export const useCustomer = (id: string) => {
  const [customer, setCustomer] = useState<CustomerWithInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerById(id);
      setCustomer(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customer");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { customer, loading, error, refetch: fetch };
};
