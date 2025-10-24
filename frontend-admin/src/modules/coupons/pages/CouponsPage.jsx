import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "../../../api/coupons";
import CouponsTable from "../components/CouponsTable";
import CouponFormModal from "../components/CouponFormModal";
import { Link } from "react-router-dom";

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const queryClient = useQueryClient();

  // Fetch coupons with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["coupons", page, limit, search, statusFilter, typeFilter],
    queryFn: async () => {
      const params = {
        page,
        limit,
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
      };
      console.log("📡 Fetching coupons with params:", params);
      try {
        const result = await couponsApi.getAll(params);
        console.log("✅ Coupons fetched:", result);
        console.log("📊 Number of coupons:", result?.data?.length);
        return result;
      } catch (err) {
        console.error("❌ Error fetching coupons:", err);
        throw err;
      }
    },
    retry: 1, // Retry once on failure
    staleTime: 10000, // Refetch every 10 seconds for real-time updates
    refetchInterval: false, // Disable auto-polling for now
  });

  // Fetch statistics
  const { data: statsData } = useQuery({
    queryKey: ["coupon-stats"],
    queryFn: couponsApi.getStats,
    retry: 1, // Retry once on failure
    staleTime: 10000,
    refetchInterval: 10000,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: couponsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      queryClient.invalidateQueries(["coupon-stats"]);
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteMutation.mutateAsync(id);
        alert("Coupon deleted successfully");
      } catch (error) {
        alert(error.message || "Failed to delete coupon");
      }
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSuccess = () => {
    refetch();
    queryClient.invalidateQueries(["coupon-stats"]);
    handleModalClose();
  };

  const stats = statsData?.data || {};

  // Debug logging
  console.log("🔍 Coupons Page Debug:", {
    data,
    isLoading,
    error,
    couponsArray: data?.data,
    couponsLength: data?.data?.length,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de cupones
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Crea y gestiona cupones de descuento para tu tienda
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Coupons
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalCoupons || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {stats.activeCoupons || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Inactive
          </div>
          <div className="text-2xl font-bold text-red-600">
            {stats.inactiveCoupons || 0}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Usage
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalUsage || 0}
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 flex-1">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600
  dark:text-white"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600
  dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600
  dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="percent">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Create Coupon
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8">Loading coupons...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          Error loading coupons: {error.message}
        </div>
      ) : (
        <CouponsTable
          coupons={data?.data || []}
          pagination={data?.pagination}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <CouponFormModal
          coupon={editingCoupon}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
