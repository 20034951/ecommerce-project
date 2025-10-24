import httpClient from "./http.js";

export const couponsApi = {
  /**
   * Get all coupons with pagination and filters
   */
  getAll: async (params = {}) => {
    // Remove undefined values from params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `/api/coupons/admin${queryString ? `?${queryString}` : ""}`;
    console.log('🌐 API URL:', url);
    return httpClient.get(url);
  },

  /**
   * Get coupon by ID
   */
  getById: async (id) => {
    return httpClient.get(`/api/coupons/admin/${id}`);
  },

  /**
   * Create a new coupon
   */
  create: async (data) => {
    return httpClient.post("/api/coupons/admin", data);
  },

  /**
   * Update a coupon
   */
  update: async (id, data) => {
    return httpClient.put(`/api/coupons/admin/${id}`, data);
  },

  /**
   * Delete a coupon
   */
  delete: async (id) => {
    return httpClient.delete(`/api/coupons/admin/${id}`);
  },

  /**
   * Get coupon statistics
   */
  getStats: async () => {
    return httpClient.get("/api/coupons/admin/stats");
  },

  /**
   * Validate a coupon code
   */
  validate: async (code, orderTotal) => {
    return httpClient.post("/api/coupons/validate", { code, orderTotal });
  },
};
