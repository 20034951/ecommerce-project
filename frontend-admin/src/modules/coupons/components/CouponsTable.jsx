import React from "react";

export default function CouponsTable({
  coupons = [],
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const styles = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      percent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      fixed:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[type] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {type === "percent" ? "Percentage" : "Fixed"}
      </span>
    );
  };

  const getUsageProgress = (used = 0, limit) => {
    if (limit === null || limit === undefined) return "Unlimited";
    const percentage = (used / limit) * 100;
    const color =
      percentage >= 90
        ? "bg-red-500"
        : percentage >= 70
          ? "bg-yellow-500"
          : "bg-green-500";

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>
            {used} / {limit}
          </span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {[
                "Code",
                "Discount",
                "Type",
                "Usage",
                "Valid Period",
                "Status",
                "Actions",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                    header === "Actions"
                      ? "text-right text-gray-500 dark:text-gray-300"
                      : "text-left text-gray-500 dark:text-gray-300"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                  key={coupon.coupon_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {coupon.code}
                      </div>
                      {coupon.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {coupon.description.substring(0, 50)}
                          {coupon.description.length > 50 ? "..." : ""}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {coupon.type === "percent"
                        ? `${coupon.discount}%`
                        : `$${coupon.discount}`}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(coupon.type)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="w-40">
                      {getUsageProgress(
                        coupon.used_count || 0,
                        coupon.usage_limit
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>{formatDate(coupon.valid_from)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      to
                    </div>
                    <div>{formatDate(coupon.valid_until)}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(coupon.status)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(coupon)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(coupon.coupon_id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      disabled={coupon.used_count > 0}
                      title={
                        coupon.used_count > 0
                          ? "Cannot delete used coupons"
                          : "Delete coupon"
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
