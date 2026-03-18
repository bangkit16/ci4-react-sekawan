import { api } from "../lib/axios";

export interface Vehicle {
  id: number;
  vehicle_brand: string;
  vehicle_number_plate: string;
}

export interface Driver {
  id: number;
  driver_name: string;
  driver_phone: string;
}

export interface Employee {
  id: number;
  employee_name: string;
  employee_phone: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CreateBookingPayload {
  vehicle_id: number;
  driver_id: number;
  requested_by_id: number;
  start_date: string;
  end_date: string;
  approver_level_1: number;
  approver_level_2: number;
}

export interface Approval {
  id: number;
  booking_id: number;
  level: number;
  approval_status: "pending" | "accepted" | "rejected";
  booking_status:
    | "pending"
    | "approve:level1"
    | "approve:level2"
    | "rejected:level1"
    | "rejected:level2";
  start_date: string;
  end_date: string;
  vehicle_brand: string;
  vehicle_number_plate: string;
  driver_name: string;
  employee_name: string;
}

export interface ApprovalDetail {
  id: number;
  level: number;
  approval_status: "pending" | "accepted" | "rejected";
  approve_date: string | null;
  approver_name: string;
  approver_email: string;
}

export class BookingService {
  static async getBookings(params?: {
    page?: number;
    search?: string;
    status?: string;
  }) {
    const response = await api.get("/api/booking", { params });
    return response.data;
  }

  static async getVehicles() {
    const response = await api.get("/api/booking/list-vehicles");
    return response.data.data;
  }

  static async getDrivers() {
    const response = await api.get("/api/booking/list-drivers");
    return response.data.data;
  }

  static async getEmployees() {
    const response = await api.get("/api/booking/list-employees");
    return response.data.data;
  }

  static async getUsers() {
    const response = await api.get("/api/booking/list-users");
    return response.data.data;
  }

  static async createBooking(data: CreateBookingPayload) {
    const response = await api.post("/api/booking", data);
    return response.data;
  }

  static async getMyApprovals() {
    const response = await api.get("/api/booking/my-approvals");
    return response.data;
  }

  static async getApprovals(bookingId: number) {
    const response = await api.get(`/api/booking/${bookingId}/approvals`);
    return response.data;
  }

  static async approveBooking(approvalId: number) {
    const response = await api.post(`/api/booking/${approvalId}/approve`);
    return response.data;
  }

  static async rejectBooking(approvalId: number, reason: string) {
    const response = await api.post(`/api/booking/${approvalId}/reject`, {
      reason,
    });
    return response.data;
  }
}
