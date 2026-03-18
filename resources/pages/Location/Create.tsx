import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { LocationsService } from "../../services/location";
import { useToastContext } from "../../utils/ToastContext";
import { api } from "../../lib/axios";

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

const locationSchema = z.object({
  location_name: z.string().min(1, "Location name is required"),
  address: z.string().min(1, "Address is required"),
  type: z.enum(["hq", "branch", "mine"], {
    message: "Please select a valid location type",
  }),
  region_id: z.string().min(1, "Region is required"),
});

type locationSchemaType = z.infer<typeof locationSchema>;

type regionType = {
  id: string;
  region_name: string;
};

function CreateLocation() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [region, setRegion] = useState<regionType[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<locationSchemaType>({
    resolver: zodResolver(locationSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: locationSchemaType) =>
      LocationsService.createLocation(data),
    onSuccess: () => {
      toast.success("Location created successfully!");
      navigate("/dashboard/locations");
    },
    onError: () => {
      toast.error("Failed to create location. Please try again.");
    },
  });

  const onSubmit = (data: locationSchemaType) => {
    mutate(data);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get(
          "/api/listregion",
        );
        setRegion(response.data); // adjust based on your API response
      } catch {
        toast.error("Failed to load locations");
      }
    };

    fetchLocations();
  }, [toast]);


  return (
    <DashboardLayout
      pageTitle="Add Location"
      breadcrumb="Dashboard · Locations · Add Location"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/locations")}
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
              Add New Location
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Register a new operational site or location.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left */}
          <div className="xl:col-span-2 space-y-5">
            <SectionCard title="Location Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Location Name"
                  required
                  error={errors.location_name?.message}
                >
                  <input
                    type="text"
                    placeholder="e.g. Jakarta HQ"
                    {...register("location_name")}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Location Type"
                  required
                  error={errors.type?.message}
                >
                  <select {...register("type")} className={inputClass}>
                    <option value="" disabled>
                      Select Type
                    </option>
                    {Object.entries({
                      hq: "Headquarter",
                      branch: "Branch",
                      mine: "Mine",
                    }).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Region"
                  required
                  error={errors.region_id?.message}
                >
                  <select {...register("region_id")} className={inputClass}>
                    <option value="" disabled>
                      Select Region
                    </option>
                    {region?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.region_name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <div className="sm:col-span-2">
                  <FormField
                    label="Full Address"
                    required
                    error={errors.address?.message}
                  >
                    <textarea
                      rows={3}
                      placeholder="e.g. Jl. Jend. Sudirman No. 1..."
                      {...register("address")}
                      className={`${inputClass} resize-none`}
                    />
                  </FormField>
                </div>
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
                  Save Location
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => navigate("/dashboard/locations")}
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

export default CreateLocation;
