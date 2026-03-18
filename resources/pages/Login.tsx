import { useNavigate } from "react-router-dom";
import ThemeToggle from "../component/ThemeToggle";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastContext } from "../utils/ToastContext";
import { Auth } from "../services/auth";
import { useMutation } from "@tanstack/react-query";

function Login() {
  const navigate = useNavigate();
  const toast = useToastContext();

  const loginSchema = z.object({
    email: z.string().email("Invalid email").min(1),
    password: z.string().min(6),
  });

  type loginSchemaType = z.infer<typeof loginSchema>;

  const {
    handleSubmit,
    register,
    formState: { },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: loginSchemaType) => Auth.login(data),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.accessToken);
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    },
  });

  const onSubmit = (data: loginSchemaType) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 relative">
      {/* Theme toggle – top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 shadow-lg shadow-amber-200 dark:shadow-amber-900/40 mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            PT. Sekawan Nickel Mining
          </h1>
          <p className="text-base font-semibold text-amber-600 dark:text-amber-400 mt-1">
            Vehicle Management System
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Nickel Mining Operations
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-none p-8">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
            Sign in to your account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Enter your credentials to access the system
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="text"
                {...register("email")}
                placeholder="admin@sekawan.co.id"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-md shadow-amber-100 dark:shadow-none active:scale-[0.98]"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Internal use only · Sekawan Nickel Mining ©{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5">
          For access issues, contact your IT Administrator
        </p>
      </div>
    </div>
  );
}

export default Login;
