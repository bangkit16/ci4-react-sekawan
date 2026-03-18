import { api } from "../lib/axios";

export const DashboardService = {
  getStats: async () => {
    const response = await api.get("api/dashboard");
    return response.data;
  },
};
