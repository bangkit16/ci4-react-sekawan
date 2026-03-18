import z from "zod";
import { api } from "../lib/axios";

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1),
  password: z.string().min(6),
});

type loginSchemaType = z.infer<typeof loginSchema>;

export class Auth {
  static isLogged(): boolean {
    return localStorage.getItem("token") !== null;
  }
  static async login(cred: loginSchemaType) {
    const response = await api.post("/api/auth/login", cred, {
      withCredentials: true,
    });
    localStorage.setItem("accessToken", response.data.accessToken);

    return response.data;
  }
  static logout() {
    localStorage.removeItem("accessToken");
  }
}
