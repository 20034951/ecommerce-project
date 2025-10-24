import httpClient from "./http.js";

const couponsApi = {
  /**
   * Validate a coupon code
   */
  validate: async (code, orderTotal) => {
    return httpClient.post("/api/coupons/validate", { code, orderTotal });
  },
};

export default couponsApi;
