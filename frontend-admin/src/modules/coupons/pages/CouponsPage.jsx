import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "../../../api/coupons";
import CouponsTable from "../components/CouponsTable";
import CouponFormModal from "../components/CouponFormModal";
import { Card, Button, Badge, Spinner } from "../../../components/ui";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Ticket,
  TrendingUp,
  BarChart3,
  X,
} from "lucide-react";

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const queryClient = useQueryClient();

  // Fetch coupons with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ["coupons", page, limit, search, statusFilter, typeFilter],
    queryFn: async () => {
      const params = {
        page,
        limit,
        search: search || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      };
      const result = await couponsApi.getAll(params);
      return result;
    },
    retry: 1,
    staleTime: 30000,
  });

  // Fetch statistics
  const { data: statsData, isLoading: loadingStats } = useQuery({
    queryKey: ["coupon-stats"],
    queryFn: couponsApi.getStats,
    retry: 1,
    staleTime: 30000,
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
    if (window.confirm("¿Estás seguro de que deseas eliminar este cupón?")) {
      try {
        await deleteMutation.mutateAsync(id);
        alert("Cupón eliminado exitosamente");
      } catch (error) {
        alert(error.message || "Error al eliminar el cupón");
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
    queryClient.invalidateQueries(["coupons"]);
    queryClient.invalidateQueries(["coupon-stats"]);
    handleModalClose();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setStatusFilter("");
    setTypeFilter("");
    setPage(1);
  };

  const stats = statsData?.data || {};
  const coupons = data?.data || [];
  const pagination = data?.pagination || {};

  const hasActiveFilters = search || statusFilter || typeFilter;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cupones de Descuento
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona cupones y promociones para tu tienda
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Cupón
        </Button>
      </div>

      {/* Stats Cards */}
      {loadingStats ? (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Cupones */}
          <Card className="p-4 bg-white dark:bg-gray-800 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Cupones
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalCoupons || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Cupones Activos */}
          <Card className="p-4 bg-white dark:bg-gray-800 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cupones Activos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.activeCoupons || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>

          {/* Cupones Inactivos */}
          <Card className="p-4 bg-white dark:bg-gray-800 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cupones Inactivos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.inactiveCoupons || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <X className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          {/* Total Usos */}
          <Card className="p-4 bg-white dark:bg-gray-800 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Usos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalUsage || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por código o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="expired">Expirado</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Todos los tipos</option>
                <option value="percent">Porcentaje</option>
                <option value="fixed">Monto Fijo</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Filtros activos:
          </span>
          {search && (
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              Búsqueda: {search}
            </Badge>
          )}
          {statusFilter && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
              Estado:{" "}
              {statusFilter === "active"
                ? "Activo"
                : statusFilter === "inactive"
                  ? "Inactivo"
                  : "Expirado"}
            </Badge>
          )}
          {typeFilter && (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              Tipo: {typeFilter === "percent" ? "Porcentaje" : "Monto Fijo"}
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      {error ? (
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">
            Error al cargar cupones: {error.message}
          </p>
        </Card>
      ) : (
        <CouponsTable
          coupons={coupons}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}

      {/* Modal */}
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
