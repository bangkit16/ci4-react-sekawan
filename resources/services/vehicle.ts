import { api } from "../lib/axios";

export type ApiResponse<T> = {
  status: number;
  data: T;
  message: string;
};

type Vehicle = {
  id: string;
  vehicle_brand: string;
  vehicle_ownership: "rent" | "owned";
  vehicle_number_plate: string;
  vehicle_year: number;
  vehicle_type: "humans" | "goods";
  vehicle_status: "available" | "booked" | "maintenance";
  vehicle_location: string;
  location_name?: string;
};

export type FuelRecord = {
  id: string;
  vehicle_id: string;
  booking_id: string;
  fuel_amount: number;
  fuel_price: number;
  fuel_date: string;
};

export type UsageRecord = {
  id: string;
  vehicle_id: string;
  booking_id: string;
  driver_id: string;
  driver_name: string;
  distance: number;
  start_time: string;
  end_time: string;
};

export type MaintenanceRecord = {
  id: string;
  vehicle_id: string;
  service_date: string;
  description: string;
  cost: number;
  next_service_date: string;
};

export type VehicleDetail = Vehicle & {
  fuels: FuelRecord[];
  usages: UsageRecord[];
  maintenances: MaintenanceRecord[];
};

export class VehiclesService {
  static async getVehicles(params?: {
    page?: number;
    search?: string;
    status?: string;
  }) {
    const response = await api.get("/api/vehicle" , {params});
    return response.data;
  }
  static async getVehicle(id: string) {
    const response = await api.get<ApiResponse<VehicleDetail>>(`api/vehicle/${id}`);
    return response.data;
  }
  static async createVehicle(data: any) {
    const response = await api.post("api/vehicle", data);
    return response;
  }
  static async updateVehicle(id: string, data: Vehicle) {
    const response = await api.put(`api/vehicle/${id}`, data);
    return response;
  }
  static async deleteVehicle(id: string) {
    const response = await api.delete(`api/vehicle/${id}`);
    return response;
  }

  static async createFuelRecord(data: any) {
    const response = await api.post("api/vehicle-fuel", data);
    return response.data;
  }
  static async updateFuelRecord(id: string, data: any) {
    const response = await api.put(`api/vehicle-fuel/${id}`, data);
    return response.data;
  }
  static async deleteFuelRecord(id: string) {
    const response = await api.delete(`api/vehicle-fuel/${id}`);
    return response.data;
  }

  static async createUsageRecord(data: any) {
    const response = await api.post("api/vehicle-usage", data);
    return response.data;
  }
  static async updateUsageRecord(id: string, data: any) {
    const response = await api.put(`api/vehicle-usage/${id}`, data);
    return response.data;
  }
  static async deleteUsageRecord(id: string) {
    const response = await api.delete(`api/vehicle-usage/${id}`);
    return response.data;
  }

  static async createMaintenanceRecord(data: any) {
    const response = await api.post("api/vehicle-maintenance", data);
    return response.data;
  }
  static async updateMaintenanceRecord(id: string, data: any) {
    const response = await api.put(`api/vehicle-maintenance/${id}`, data);
    return response.data;
  }
  static async deleteMaintenanceRecord(id: string) {
    const response = await api.delete(`api/vehicle-maintenance/${id}`);
    return response.data;
  }
}
