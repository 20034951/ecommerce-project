import { useState, useEffect, useCallback } from 'react';
import {
    getSalesSummary,
    getSalesByCategory,
    getTopProducts,
    getSalesOverTime,
    getSalesComparison,
    getFirstOrderDate,
    getPaymentMethodsReport,
    getCouponsReport
} from '../api/reportsApi';

/**
 * Hook para manejar reportes de ventas
 * @param {Object} defaultFilters - Filtros por defecto { startDate, endDate }
 */
export const useReports = (defaultFilters = {}) => {
    const [filters, setFilters] = useState(defaultFilters);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para cada tipo de reporte
    const [summary, setSummary] = useState(null);
    const [categorySales, setCategorySales] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [salesOverTime, setSalesOverTime] = useState([]);
    const [salesComparison, setSalesComparison] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [coupons, setCoupons] = useState(null);

    // Cargar resumen de ventas
    const loadSummary = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const params = { ...filters, ...customFilters };
            const data = await getSalesSummary(params);
            setSummary(data);
        } catch (err) {
            setError(err.message || 'Error al cargar resumen de ventas');
            console.error('Error loading sales summary:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Cargar ventas por categoría
    const loadCategorySales = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const params = { ...filters, ...customFilters };
            const data = await getSalesByCategory(params);
            setCategorySales(data);
        } catch (err) {
            setError(err.message || 'Error al cargar ventas por categoría');
            console.error('Error loading category sales:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Cargar top productos
    const loadTopProducts = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const params = { ...filters, ...customFilters };
            const data = await getTopProducts(params);
            setTopProducts(data);
        } catch (err) {
            setError(err.message || 'Error al cargar top productos');
            console.error('Error loading top products:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Cargar ventas en el tiempo
    const loadSalesOverTime = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const params = { ...filters, ...customFilters };
            const data = await getSalesOverTime(params);
            setSalesOverTime(data);
        } catch (err) {
            setError(err.message || 'Error al cargar ventas en el tiempo');
            console.error('Error loading sales over time:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Cargar comparación de ventas
    const loadSalesComparison = useCallback(async (customFilters = {}) => {
        try {
            const params = { ...filters, ...customFilters };

            // Validar que existan startDate y endDate antes de hacer la petición
            if (!params.startDate || !params.endDate) {
                console.warn('Sales comparison skipped: missing startDate or endDate', params);
                return;
            }

            console.log('Loading sales comparison with params:', params);
            const data = await getSalesComparison(params);
            setSalesComparison(data);
            console.log('Sales comparison loaded successfully:', data);
        } catch (err) {
            // No establecer error general, solo loguear
            console.warn('Error loading sales comparison:', err.message, err);
            setSalesComparison(null);
        }
    }, [filters]);

    // Cargar todos los reportes
    const loadAllReports = useCallback(async (customFilters = {}) => {
        const params = { ...filters, ...customFilters };

        try {
            setLoading(true);
            setError(null);

            // Cargar todos los reportes en paralelo
            const [summaryData, categoryData, topProductsData, salesTimeData] = await Promise.all([
                getSalesSummary(params),
                getSalesByCategory(params),
                getTopProducts(params),
                getSalesOverTime(params)
            ]);

            setSummary(summaryData);
            setCategorySales(categoryData);
            setTopProducts(topProductsData);
            setSalesOverTime(salesTimeData);
        } catch (err) {
            setError(err.message || 'Error al cargar reportes');
            console.error('Error loading all reports:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Actualizar filtros
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    // Resetear filtros
    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, [defaultFilters]);

    // Obtener fecha de la primera orden
    const loadFirstOrderDate = useCallback(async () => {
        try {
            const response = await getFirstOrderDate();
            // response ya es el objeto data: { firstOrderDate: "..." }
            const firstDate = response?.firstOrderDate;
            if (!firstDate) {
                console.warn('No first order date found, using today');
                return new Date().toISOString().split('T')[0];
            }
            return firstDate;
        } catch (err) {
            console.error('Error loading first order date:', err);
            return new Date().toISOString().split('T')[0];
        }
    }, []);

    // Cargar reporte de métodos de pago
    const loadPaymentMethods = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const params = { ...filters, ...customFilters };
            const data = await getPaymentMethodsReport(params);
            setPaymentMethods(data);
        } catch (err) {
            setError(err.message || 'Error al cargar métodos de pago');
            console.error('Error loading payment methods:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Cargar reporte de cupones
    const loadCoupons = useCallback(async (customFilters = {}) => {
        try {
            setLoading(true);
            setError(null);
            const params = { ...filters, ...customFilters };
            const data = await getCouponsReport(params);
            setCoupons(data);
        } catch (err) {
            setError(err.message || 'Error al cargar cupones');
            console.error('Error loading coupons:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    return {
        // Estados
        filters,
        loading,
        error,
        summary,
        categorySales,
        topProducts,
        salesOverTime,
        salesComparison,
        paymentMethods,
        coupons,

        // Métodos
        loadSummary,
        loadCategorySales,
        loadTopProducts,
        loadSalesOverTime,
        loadSalesComparison,
        loadAllReports,
        updateFilters,
        resetFilters,
        loadFirstOrderDate,
        loadPaymentMethods,
        loadCoupons
    };
};

export default useReports;
