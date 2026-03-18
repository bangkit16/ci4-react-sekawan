import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { VehiclesService } from "../../services/vehicle";
import { useToastContext } from "../../utils/ToastContext";

type LocationList = {
  id: string;
  location_name: string;
};

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

const vehicleSchema = z.object({
  vehicle_brand: z.string().min(1, "Vehicle brand is required"),
  vehicle_ownership: z.enum(["owned", "rent"], {
    message: "Please select an ownership type",
  }),
  vehicle_number_plate: z.string().min(1, "License plate is required"),
  vehicle_year: z.number().min(1900, "Year must be valid"),
  vehicle_type: z.enum(["humans", "goods"], {
    message: "Please select a vehicle type",
  }),
  vehicle_status: z.enum(["available", "booked", "maintenance"], {
    message: "Please select a status",
  }),
  vehicle_location: z.string().min(1, "Location is required"),
});

// 2. Infer the type from the schema
type vehicleSchemaType = z.infer<typeof vehicleSchema>;

function CreateVehicle() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [locations, setLocations] = useState<LocationList[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<vehicleSchemaType>({
    resolver: zodResolver(vehicleSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: vehicleSchemaType) =>
      VehiclesService.createVehicle(data),
    onSuccess: () => {
      toast.success("Vehicle created successfully!");
      navigate("/dashboard/vehicles");
    },
    onError: () => {
      toast.error("Failed to create vehicle. Please try again.");
    },
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get(
          "api/listlocation",
        );
        setLocations(response.data); // adjust based on your API response
      } catch (error) {
        toast.error("Failed to load locations");
      }
    };

    fetchLocations();
  }, [toast]);

  const onSubmit = (data: vehicleSchemaType) => {
    mutate(data);
  };

  return (
    <DashboardLayout
      pageTitle="Add Vehicle"
      breadcrumb="Dashboard · Vehicles · Add Vehicle"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/vehicles")}
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
              Add New Vehicle
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Register a new vehicle to the operational fleet.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left */}
          <div className="xl:col-span-2 space-y-5">
            <SectionCard title="Basic Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Vehicle Brand"
                  required
                  error={errors.vehicle_brand?.message}
                >
                  <input
                    type="text"
                    placeholder="e.g. Toyota Hilux"
                    {...register("vehicle_brand")}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="License Plate"
                  required
                  error={errors.vehicle_number_plate?.message}
                >
                  <input
                    type="text"
                    placeholder="e.g. B 1234 XY"
                    {...register("vehicle_number_plate")}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Year"
                  required
                  error={errors.vehicle_year?.message}
                >
                  <input
                    type="number"
                    placeholder="e.g. 2012"
                    {...register("vehicle_year", { valueAsNumber: true })}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Vehicle Type"
                  required
                  error={errors.vehicle_type?.message}
                >
                  <select {...register("vehicle_type")} className={inputClass}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {Object.entries({
                      humans: "Humans Transportation",
                      goods: "Goods Transportation",
                    }).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Ownerships"
                  required
                  error={errors.vehicle_ownership?.message}
                >
                  <select
                    {...register("vehicle_ownership")}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Ownerships
                    </option>
                    {Object.entries({
                      owned: "Owned",
                      rent: "Rent",
                    }).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Vehicle Location"
                  required
                  error={errors.vehicle_location?.message}
                >
                  <select
                    {...register("vehicle_location")}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Location
                    </option>
                    {locations?.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </SectionCard>

            {/* <SectionCard title="Additional Notes">
              <textarea
                name="notes"
                rows={4}
                placeholder="Optional notes about the vehicle condition, features, etc."
                className={`${inputClass} resize-none`}
              />
            </SectionCard> */}
          </div>

          {/* Right */}
          <div className="space-y-5">
            <SectionCard title="Operational Status">
              <FormField
                label="Status Operation"
                required
                error={errors.vehicle_status?.message}
              >
                <select {...register("vehicle_status")} className={inputClass}>
                  <option value="" disabled>
                    Select Ownerships
                  </option>
                  {Object.entries({
                    available: "Available",
                    booked: "Booked",
                    maintenance: "Maintenance",
                  }).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </FormField>
            </SectionCard>

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
                  Save Vehicle
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => navigate("/dashboard/vehicles")}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 leading-relaxed">
                Fields marked with <span className="text-red-500">*</span> are
                required. The vehicle will be immediately visible in the fleet
                list after saving.
              </p>
            </SectionCard>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default CreateVehicle;
