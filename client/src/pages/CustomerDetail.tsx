import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  CreditCard,
  Tag,
} from "lucide-react";
import { useCustomer } from "../hooks/useCustomers";
import { PageLoader } from "../common/PageLoader";
import { ErrorState } from "../common/ErrorState";
import { StatusBadge } from "../common/StatusBadge";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
} from "../utils";
import { CHANNEL_COLORS, CHANNEL_LABELS, RISK_FLAG_CONFIG } from "../constants";

export const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { customer, loading, error, refetch } = useCustomer(id ?? "");

  if (loading) return <PageLoader />;
  if (error || !customer)
    return (
      <ErrorState message={error ?? "Customer not found"} onRetry={refetch} />
    );

  const riskConfig = RISK_FLAG_CONFIG[customer.aiInsight.riskFlag];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/customers" className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-surface-500">Customer Profile</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Profile */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-600/20 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-400">
                  {customer.firstName[0]}
                  {customer.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-surface-100">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-xs text-surface-500">
                  Customer since {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-surface-500 shrink-0" />
                <span className="text-surface-300">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-surface-500 shrink-0" />
                  <span className="text-surface-300">{customer.phone}</span>
                </div>
              )}
              {customer.city && (
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-surface-500 shrink-0" />
                  <span className="text-surface-300">{customer.city}</span>
                </div>
              )}
            </div>

            <div className="divider my-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">
                  Preferred Channel
                </span>
                <StatusBadge
                  label={
                    CHANNEL_LABELS[customer.preferredChannel] ??
                    customer.preferredChannel
                  }
                  colorClass={CHANNEL_COLORS[customer.preferredChannel] ?? ""}
                />
              </div>
              {customer.aiSegmentTags.length > 0 && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs text-surface-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {customer.aiSegmentTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-2xs bg-surface-800 text-surface-400 px-2 py-0.5 rounded-full border border-surface-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Insight */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-surface-200">
                AI Insight
              </h3>
              {riskConfig && (
                <StatusBadge
                  label={riskConfig.label}
                  colorClass={riskConfig.color}
                />
              )}
            </div>
            <p className="text-sm text-surface-400 leading-relaxed">
              {customer.aiInsight.summary}
            </p>
          </div>
        </div>

        {/* Right: Stats + Orders */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <CreditCard className="w-5 h-5 text-brand-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-surface-50">
                {formatCurrency(customer.totalSpend)}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">Total Spend</p>
            </div>
            <div className="card p-4 text-center">
              <ShoppingBag className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-surface-50">
                {customer.totalOrders}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">Total Orders</p>
            </div>
            <div className="card p-4 text-center">
              <Calendar className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-surface-50">
                {customer.lastOrderAt
                  ? formatRelativeTime(customer.lastOrderAt)
                  : "Never"}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">Last Order</p>
            </div>
          </div>

          {/* Order History */}
          <div className="card">
            <div className="px-5 py-4 border-b border-surface-800">
              <h3 className="section-title">Order History</h3>
            </div>
            {customer.orders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-surface-600">No orders yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    {["Order #", "Amount", "Category", "Channel", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {customer.orders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-surface-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-surface-300">
                          {o.orderNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-surface-100">
                          {formatCurrency(o.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-surface-400">
                          {o.productCategory ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-surface-400">
                          {o.channel ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-surface-400">
                          {formatDateTime(o.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
