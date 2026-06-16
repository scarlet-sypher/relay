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
    <div className="p-5 space-y-5 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <Link to="/customers" className="btn-ghost p-1.5">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-[11px] text-surface-500 mt-0.5">Customer Profile</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Profile */}
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-brand-400">
                  {customer.firstName[0]}
                  {customer.lastName[0]}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-[13px] text-surface-100 truncate">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-[11px] text-surface-500 mt-0.5 truncate">
                  Customer since {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[13px]">
                <Mail className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                <span className="text-surface-300 truncate">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-[13px]">
                  <Phone className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                  <span className="text-surface-300 truncate">{customer.phone}</span>
                </div>
              )}
              {customer.city && (
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                  <span className="text-surface-300 truncate">{customer.city}</span>
                </div>
              )}
            </div>

            <div className="divider my-3" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-surface-500">
                  Preferred Channel
                </span>
                <div className="scale-90 origin-right">
                  <StatusBadge
                    label={
                      CHANNEL_LABELS[customer.preferredChannel] ??
                      customer.preferredChannel
                    }
                    colorClass={CHANNEL_COLORS[customer.preferredChannel] ?? ""}
                  />
                </div>
              </div>
              {customer.aiSegmentTags.length > 0 && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] text-surface-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {customer.aiSegmentTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-surface-800 text-surface-400 px-1.5 py-0.5 rounded border border-[#252d3e]"
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
          <div className="card p-4 border-brand-600/30 bg-brand-600/5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-medium text-brand-400 uppercase tracking-wider">
                ✦ AI Insight
              </h3>
              {riskConfig && (
                <div className="scale-90 origin-right">
                  <StatusBadge
                    label={riskConfig.label}
                    colorClass={riskConfig.color}
                  />
                </div>
              )}
            </div>
            <p className="text-[13px] text-surface-300 leading-relaxed">
              {customer.aiInsight.summary}
            </p>
          </div>
        </div>

        {/* Right: Stats + Orders */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 text-center">
              <CreditCard className="w-4 h-4 text-brand-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-surface-50">
                {formatCurrency(customer.totalSpend)}
              </p>
              <p className="text-[11px] text-surface-500 mt-0.5">Total Spend</p>
            </div>
            <div className="card p-4 text-center">
              <ShoppingBag className="w-4 h-4 text-green-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-surface-50">
                {customer.totalOrders}
              </p>
              <p className="text-[11px] text-surface-500 mt-0.5">Total Orders</p>
            </div>
            <div className="card p-4 text-center">
              <Calendar className="w-4 h-4 text-yellow-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-surface-50">
                {customer.lastOrderAt
                  ? formatRelativeTime(customer.lastOrderAt)
                  : "Never"}
              </p>
              <p className="text-[11px] text-surface-500 mt-0.5">Last Order</p>
            </div>
          </div>

          {/* Order History */}
          <div className="card">
            <div className="px-4 py-3 border-b border-[#252d3e]">
              <h3 className="section-title">Order History</h3>
            </div>
            {customer.orders.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-surface-600">No orders yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#252d3e]">
                    {["Order #", "Amount", "Category", "Channel", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-[11px] font-medium text-surface-500 uppercase tracking-wider bg-surface-900/50"
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
                      className="hover:bg-surface-800/30 transition-colors"
                    >
                      <td className="px-4 py-2">
                        <span className="font-mono text-[11px] text-surface-300">
                          {o.orderNumber}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-medium text-[13px] text-surface-100">
                          {formatCurrency(o.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[13px] text-surface-400">
                          {o.productCategory ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[13px] text-surface-400">
                          {o.channel ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[11px] text-surface-500">
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
