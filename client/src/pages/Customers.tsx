import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, Plus, Mail, Phone } from "lucide-react";
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
  const toast = useToast();

  const filtered = useMemo(
    () =>
      customers.filter((c) =>
        `${c.firstName} ${c.lastName} ${c.email}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [customers, search],
  );

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
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {total} total customers
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Customer
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
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="w-7 h-7" />}
            title="No customers found"
            description="Add your first customer to get started"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    {[
                      "Customer",
                      "Email",
                      "Phone",
                      "Spend",
                      "Orders",
                      "Last Order",
                      "Channel",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-surface-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-brand-400">
                              {getInitials(c.firstName, c.lastName)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-100">
                              {c.firstName} {c.lastName}
                            </p>
                            {c.city && (
                              <p className="text-xs text-surface-500">
                                {c.city}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-surface-300">
                          <Mail className="w-3.5 h-3.5 text-surface-500" />
                          {c.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.phone ? (
                          <div className="flex items-center gap-1.5 text-sm text-surface-300">
                            <Phone className="w-3.5 h-3.5 text-surface-500" />
                            {c.phone}
                          </div>
                        ) : (
                          <span className="text-surface-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-surface-100">
                          {formatCurrency(c.totalSpend)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-surface-300">
                          {c.totalOrders}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-surface-400">
                          {c.lastOrderAt
                            ? formatRelativeTime(c.lastOrderAt)
                            : "Never"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={
                            CHANNEL_LABELS[c.preferredChannel] ??
                            c.preferredChannel
                          }
                          colorClass={CHANNEL_COLORS[c.preferredChannel] ?? ""}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/customers/${c.id}`}
                          className="text-xs text-brand-400 hover:text-brand-300 font-medium"
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
