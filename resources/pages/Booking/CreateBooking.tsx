import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import { BookingService } from "../../services/booking";
import { api } from "../../lib/axios";
import { useToastContext } from "../../utils/ToastContext";

// Zod schema validation
const bookingSchema = z
  .object({
    vehicle_id: z.coerce.number().min(1, "Vehicle is required"),
    driver_id: z.coerce.number().min(1, "Driver is required"),
    requested_by_id: z.coerce.number().min(1, "Employee is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    approver_level_1: z.coerce.number().min(1, "Approver Level 1 is required"),
    approver_level_2: z.coerce.number().min(1, "Approver Level 2 is required"),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

type BookingFormData = z.infer<typeof bookingSchema>;

const inputClass =
  "w-full border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all px-4 py-2.5";

const labelClass =
  "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

const errorClass = "text-red-500 dark:text-red-400 text-xs mt-1";

function CreateBooking() {
  const toast = useToastContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Fetch list data
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => BookingService.getVehicles(),
  });

  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => BookingService.getDrivers(),
  });

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => BookingService.getEmployees(),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => BookingService.getUsers(),
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: BookingFormData) => BookingService.createBooking(data),
    onSuccess: () => {
      toast.success("Booking created successfully!");
      navigate("/dashboard/bookings");
    },
    onError: (error: any) => {
      toast.error(
        "Failed to create booking: " +
          (error.response?.data?.message || error.message),
      );
    },
  });

  const isLoading =
    vehiclesLoading || driversLoading || employeesLoading || usersLoading;

  const onSubmit = (data: BookingFormData) => {
    createBookingMutation.mutate(data);
  };

  return (
    <DashboardLayout
      pageTitle="Create Booking"
      breadcrumb="Dashboard · Bookings · Create"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Create New Booking
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Fill in the details below to request a vehicle.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          }
        >
          Back
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                Vehicle & Driver Information
              </h3>
            </div>

            <div>
              <label htmlFor="vehicle_id" className={labelClass}>
                Vehicle *
              </label>
              <select
                id="vehicle_id"
                {...register("vehicle_id")}
                className={inputClass}
                disabled={isLoading}
              >
                <option value="">Select a vehicle</option>
                {vehicles?.map((vehicle: any) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicle_brand} ({vehicle.vehicle_number_plate})
                  </option>
                ))}
              </select>
              {errors.vehicle_id && (
                <span className={errorClass}>{errors.vehicle_id.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="driver_id" className={labelClass}>
                Driver *
              </label>
              <select
                id="driver_id"
                {...register("driver_id")}
                className={inputClass}
                disabled={isLoading}
              >
                <option value="">Select a driver</option>
                {drivers?.map((driver: any) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.driver_name}
                  </option>
                ))}
              </select>
              {errors.driver_id && (
                <span className={errorClass}>{errors.driver_id.message}</span>
              )}
            </div>

            {/* Employee Information */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                Request Information
              </h3>
            </div>

            <div>
              <label htmlFor="requested_by_id" className={labelClass}>
                Employee *
              </label>
              <select
                id="requested_by_id"
                {...register("requested_by_id")}
                className={inputClass}
                disabled={isLoading}
              >
                <option value="">Select an employee</option>
                {employees?.map((employee: any) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.employee_name}
                  </option>
                ))}
              </select>
              {errors.requested_by_id && (
                <span className={errorClass}>
                  {errors.requested_by_id.message}
                </span>
              )}
            </div>

            {/* Approval Information */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                Approval Chain
              </h3>
            </div>

            <div>
              <label htmlFor="approver_level_1" className={labelClass}>
                Approver Level 1 *
              </label>
              <select
                id="approver_level_1"
                {...register("approver_level_1")}
                className={inputClass}
                disabled={isLoading}
              >
                <option value="">Select approver level 1</option>
                {users
                  ?.filter(
                    (user: any) =>
                      user.role === "approver" || user.role === "admin",
                  )
                  .map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
              {errors.approver_level_1 && (
                <span className={errorClass}>
                  {errors.approver_level_1.message}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="approver_level_2" className={labelClass}>
                Approver Level 2 *
              </label>
              <select
                id="approver_level_2"
                {...register("approver_level_2")}
                className={inputClass}
                disabled={isLoading}
              >
                <option value="">Select approver level 2</option>
                {users
                  ?.filter(
                    (user: any) =>
                      user.role === "approver" || user.role === "admin",
                  )
                  .map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
              {errors.approver_level_2 && (
                <span className={errorClass}>
                  {errors.approver_level_2.message}
                </span>
              )}
            </div>

            {/* Schedule Information */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
                Schedule & Duration
              </h3>
            </div>

            <div>
              <label htmlFor="start_date" className={labelClass}>
                Start Date & Time *
              </label>
              <input
                id="start_date"
                type="datetime-local"
                {...register("start_date")}
                className={inputClass}
              />
              {errors.start_date && (
                <span className={errorClass}>{errors.start_date.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="end_date" className={labelClass}>
                End Date & Time *
              </label>
              <input
                id="end_date"
                type="datetime-local"
                {...register("end_date")}
                className={inputClass}
              />
              {errors.end_date && (
                <span className={errorClass}>{errors.end_date.message}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-700 mt-8">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              type="button"
              disabled={createBookingMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || createBookingMutation.isPending}
            >
              {createBookingMutation.isPending
                ? "Creating..."
                : "Create Booking"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateBooking;
