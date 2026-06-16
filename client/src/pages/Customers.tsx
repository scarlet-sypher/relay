import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, Plus, Mail, Phone, ChevronUp, ChevronDown } from "lucide-react";
import { useCustomers } from "../hooks/useCustomers";
import { createCustomer } from "../api/customers.api";
import { useToast } from "../contexts/ToastContext";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { EmptyState } from "../common/EmptyState";
import { SearchInput } from "../common/SearchInput";
import { Pagination } from "../common/Pagination";
import { StatusBadge } from "../common/StatusBadge";
import { formatCurrency, formatRelativeTime, getInitials } from "../utils";
import { CHANNEL_COLORS, CHANNEL_LABELS } from "../constants";
import type { CreateCustomerPayload, Channel } from "../types/api.types";

const BLANK: CreateCustomerPayload = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  preferredChannel: "EMAIL",
};

export const Customers = () => {
  const [page, setPage] = useState(1);
  const { customers, total, loading, error, refetch } = useCustomers(page, 20);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateCustomerPayload>(BLANK);
  const [creating, setCreating] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const toast = useToast();

  const filteredAndSorted = useMemo(() => {
    let result = customers.filter((c) => {
      const searchStr = `${c.firstName} ${c.lastName} ${c.email} ${c.phone ?? ""} ${c.city ?? ""} ${c.preferredChannel}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof typeof a];
        let bVal: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key === "name") {
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
        } else if (sortConfig.key === "totalSpend") {
          aVal = parseFloat(a.totalSpend as string) || 0;
          bVal = parseFloat(b.totalSpend as string) || 0;
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [customers, search, sortConfig]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error(
        "Validation Error",
        "First name, last name and email are required",
      );
      return;
    }
    setCreating(true);
    try {
      await createCustomer(form);
      toast.success(
        "Customer created",
        `${form.firstName} ${form.lastName} added`,
      );
      setShowCreate(false);
      setForm(BLANK);
      void refetch();
    } catch (e) {
      toast.error(
        "Failed to create customer",
        e instanceof Error ? e.message : undefined,
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-[13px] text-surface-500 mt-0.5">
            {total} total customers
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-3.5 h-3.5" /> Add Customer
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 p-4 border-b border-surface-800">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search customers..."
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <PageLoader />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filteredAndSorted.length === 0 ? (
          <EmptyState
            icon={<Users className="w-7 h-7" />}
            title="No customers found"
            description={search ? "No customers match your search criteria" : "Add your first customer to get started"}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    {[
                      { label: "Customer", key: "name" },
                      { label: "Email", key: "email" },
                      { label: "Phone", key: "phone" },
                      { label: "Spend", key: "totalSpend" },
                      { label: "Orders", key: "totalOrders" },
                      { label: "Last Order", key: "lastOrderAt" },
                      { label: "Channel", key: "preferredChannel" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="text-left px-4 py-2.5 text-[11px] font-medium text-surface-500 uppercase tracking-wider bg-surface-900/50 cursor-pointer hover:bg-surface-800 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-3 h-3 text-brand-400" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-brand-400" />
                            )
                          ) : (
                            <div className="flex flex-col -space-y-1 opacity-20 group-hover:opacity-100">
                              <ChevronUp className="w-2.5 h-2.5" />
                              <ChevronDown className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-2.5 bg-surface-900/50"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {filteredAndSorted.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-surface-800/30 transition-colors"
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-600/20 flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-bold text-brand-400">
                              {getInitials(c.firstName, c.lastName)}
                            </span>
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-surface-100">
                              {c.firstName} {c.lastName}
                            </p>
                            {c.city && (
                              <p className="text-[11px] text-surface-500">
                                {c.city}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5 text-[13px] text-surface-300">
                          <Mail className="w-3 h-3 text-surface-500" />
                          {c.email}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {c.phone ? (
                          <div className="flex items-center gap-1.5 text-[13px] text-surface-300">
                            <Phone className="w-3 h-3 text-surface-500" />
                            {c.phone}
                          </div>
                        ) : (
                          <span className="text-surface-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[13px] font-medium text-surface-100">
                          {formatCurrency(c.totalSpend)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[13px] text-surface-300">
                          {c.totalOrders}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[13px] text-surface-400">
                          {c.lastOrderAt
                            ? formatRelativeTime(c.lastOrderAt)
                            : "Never"}
                        </span>
                      </td>
                      <td className="px-4 py-2 scale-90 origin-left">
                        <StatusBadge
                          label={
                            CHANNEL_LABELS[c.preferredChannel] ??
                            c.preferredChannel
                          }
                          colorClass={CHANNEL_COLORS[c.preferredChannel] ?? ""}
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Link
                          to={`/customers/${c.id}`}
                          className="text-[11px] text-brand-400 hover:text-brand-300 font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              total={total}
              limit={20}
              onPageChange={setPage}
            />
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
          <div className="relative card p-6 w-full max-w-lg shadow-modal animate-slide-up">
            <h2 className="section-title mb-5">Add New Customer</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input
                    className="input-base"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="Priya"
                  />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input
                    className="input-base"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    placeholder="Sharma"
                  />
                </div>
              </div>
              <div>
                <label className="label">Email *</label>
                <input
                  className="input-base"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="priya@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input-base"
                    value={form.phone ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+91..."
                  />
                </div>
                <div>
                  <label className="label">City</label>
                  <input
                    className="input-base"
                    value={form.city ?? ""}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Mumbai"
                  />
                </div>
              </div>
              <div>
                <label className="label">Preferred Channel</label>
                <select
                  className="input-base"
                  value={form.preferredChannel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferredChannel: e.target.value as Channel,
                    })
                  }
                >
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="WHATSAPP">WhatsApp</option>
                </select>
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
                {creating ? "Creating..." : "Create Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
