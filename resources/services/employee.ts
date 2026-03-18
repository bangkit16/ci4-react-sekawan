import { api } from "../lib/axios";

type Employee = {
  id: string;
  employee_name: string;
  employee_phone: string;
  employee_position: string;
  employee_email: string;
};

export class EmployeesService {
  static async getEmployees(params?: { page?: number; search?: string }) {
    const response = await api.get("/api/employee", { params });
    return response.data;
  }
  static async getEmployee(id: string) {
    const response = await api.get(`api/employee/${id}`);
    return response;
  }
  static async createEmployee(data: any) {
    const response = await api.post("api/employee", data);
    return response;
  }
  static async updateEmployee(id: string, data: Employee) {
    const response = await api.put(`api/employee/${id}`, data);
    return response;
  }
  static async deleteEmployee(id: string) {
    const response = await api.delete(`api/employee/${id}`);
    return response;
  }
}
