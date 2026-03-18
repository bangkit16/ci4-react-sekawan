import { api } from "../lib/axios";

type Driver = {
  id: string;
  driver_name: string;
  driver_phone: string;
};

export class DriversService {
  static async getDrivers(params?: { page?: number; search?: string }) {
    const response = await api.get("/api/driver", { params });
    return response.data;
  }
  static async getDriver(id: string) {
    const response = await api.get(`api/driver/${id}`);
    return response;
  }
  static async createDriver(data: any) {
    const response = await api.post("api/driver", data);
    return response;
  }
  static async updateDriver(id: string, data: Driver) {
    const response = await api.put(`api/driver/${id}`, data);
    return response;
  }
  static async deleteDriver(id: string) {
    const response = await api.delete(`api/driver/${id}`);
    return response;
  }
}
