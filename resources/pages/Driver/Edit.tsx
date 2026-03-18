import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DriversService } from "../../services/driver";
import { useToastContext } from "../../utils/ToastContext";

const inputClass =
  "w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all";

function FormField({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      <p className="text-red-500 text-xs mt-1">{error}</p>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-slate-700">
        {title}
      </h3>
      {children}
    </div>
  );
}

const driverSchema = z.object({
  driver_name: z.string().min(1, "Driver name is required"),
  driver_phone: z.string().min(1, "Phone number is required"),
});

type driverSchemaType = z.infer<typeof driverSchema>;

function EditDriver() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToastContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<driverSchemaType>({
    resolver: zodResolver(driverSchema),
  });

  const { data: driverData, isLoading: isFetching } = useQuery({
    queryKey: ["driver", id],
    queryFn: () => DriversService.getDriver(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (driverData?.data?.data) {
      const { driver_name, driver_phone } = driverData.data.data;
      setValue("driver_name", driver_name);
      setValue("driver_phone", driver_phone);
    }
  }, [driverData, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: driverSchemaType) =>
      DriversService.updateDriver(id!, data as any),
    onSuccess: () => {
      toast.success("Driver updated successfully!");
      navigate("/dashboard/drivers");
    },
    onError: () => {
      toast.error("Failed to update driver. Please try again.");
    },
  });

  const onSubmit = (data: driverSchemaType) => {
    mutate(data);
  };

  if (isFetching) {
    return (
      <DashboardLayout
        pageTitle="Edit Driver"
        breadcrumb="Dashboard · Drivers · Edit Driver"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading driver data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      pageTitle="Edit Driver"
      breadcrumb="Dashboard · Drivers · Edit Driver"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/drivers")}
            className="w-9 h-9 flex-shrink-0 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              Edit Driver
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Update driver information.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left */}
          <div className="xl:col-span-2 space-y-5">
            <SectionCard title="Driver Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Driver Name"
                  required
                  error={errors.driver_name?.message}
                >
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    {...register("driver_name")}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Phone Number"
                  required
                  error={errors.driver_phone?.message}
                >
                  <input
                    type="text"
                    placeholder="e.g. +62 812 3456 7890"
                    {...register("driver_phone")}
                    className={inputClass}
                  />
                </FormField>
              </div>
            </SectionCard>
          </div>

          {/* Right */}
          <div className="space-y-5">
            <SectionCard title="Actions">
              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isPending}
                  className="w-full justify-center"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  }
                >
                  Update Driver
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => navigate("/dashboard/drivers")}
                >
                  Cancel
                </Button>
              </div>
            </SectionCard>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default EditDriver;
