import { api } from "../lib/axios";

type Location = {
  id: string;
  location_name: string;
  address: string;
  type: string;
};

export class LocationsService {
  static async getLocations(params?: { page?: number; search?: string }) {
    const response = await api.get("/api/location", { params });
    return response.data;
  }
  static async getLocation(id: string) {
    const response = await api.get(`api/location/${id}`);
    return response;
  }
  static async createLocation(data: any) {
    const response = await api.post("api/location", data);
    return response;
  }
  static async updateLocation(id: string, data: Location) {
    const response = await api.put(`api/location/${id}`, data);
    return response;
  }
  static async deleteLocation(id: string) {
    const response = await api.delete(`api/location/${id}`);
    return response;
  }
}
