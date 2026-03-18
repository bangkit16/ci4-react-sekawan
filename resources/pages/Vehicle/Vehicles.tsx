import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VehiclesService } from "../../services/vehicle";
import useDebounce from "../../hooks/useDebounce";
import Pagination from "../../component/Pagination";
import { Modal } from "../../component/Modal";
import { useToastContext } from "../../utils/ToastContext";

type Vehicle = {
  id: string;
  vehicle_brand: string;
  vehicle_ownership: "rent" | "owned";
  vehicle_number_plate: string;
  vehicle_year: number;
  vehicle_type: "humans" | "goods";
  vehicle_status: "available" | "booked" | "maintenance";
  location_name: string;
};


// const vehicleData: Vehicle[] = [
//   {
//     id: "V-001",
//     name: "Toyota Hilux",
//     plate: "B 1234 XY",
//     type: "Pickup",
//     fuel: "Diesel",
//     year: 2021,
//     status: "Available",
//     location: "HQ Parking",
//   },
//   {
//     id: "V-002",
//     name: "Mitsubishi L300",
//     plate: "B 5678 AB",
//     type: "Minibus",
//     fuel: "Diesel",
//     year: 2020,
//     status: "In Use",
//     location: "Site B",
//   },
//   {
//     id: "V-003",
//     name: "Isuzu Panther",
//     plate: "B 9012 CD",
//     type: "SUV",
//     fuel: "Diesel",
//     year: 2019,
//     status: "Maintenance",
//     location: "Workshop",
//   },
//   {
//     id: "V-004",
//     name: "Toyota Fortuner",
//     plate: "B 3456 EF",
//     type: "SUV",
//     fuel: "Diesel",
//     year: 2022,
//     status: "Available",
//     location: "HQ Parking",
//   },
//   {
//     id: "V-005",
//     name: "Daihatsu Gran Max",
//     plate: "B 7890 GH",
//     type: "Minibus",
//     fuel: "Bensin",
//     year: 2020,
//     status: "Available",
//     location: "Kantor Cabang",
//   },
//   {
//     id: "V-006",
//     name: "Ford Ranger",
//     plate: "B 2345 IJ",
//     type: "Pickup",
//     fuel: "Diesel",
//     year: 2023,
//     status: "In Use",
//     location: "Site A",
//   },
//   {
//     id: "V-007",
//     name: "Toyota Kijang",
//     plate: "B 6789 KL",
//     type: "MPV",
//     fuel: "Bensin",
//     year: 2018,
//     status: "Available",
//     location: "HQ Parking",
//   },
//   {
//     id: "V-008",
//     name: "Isuzu Elf",
//     plate: "B 0123 MN",
//     type: "Minibus",
//     fuel: "Diesel",
//     year: 2021,
//     status: "Maintenance",
//     location: "Workshop",
//   },
// ];

const statusStyle: Record<string, string> = {
  available:
    "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
  booked:
    "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
  maintenance:
    "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
};

const inputClass =
  "border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all";

function Vehicles() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );
  const [selectedVehicleName, setSelectedVehicleName] = useState<string>("");

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";

  const debouncedSearch = useDebounce(search, 500);
  // const debouncedFilter = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["vehicles", page, debouncedSearch, status],
    queryFn: () =>
      VehiclesService.getVehicles({
        page,
        search: debouncedSearch,
        status: status === "All" ? "" : status,
      }),
  });

  const { mutate: deleteVehicle, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => VehiclesService.deleteVehicle(id),
    onSuccess: () => {
      toast.success("Vehicle deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedVehicleId(null);
      setSelectedVehicleName("");
      // Refetch the list
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    
    onError: () => {
      toast.error("Failed to delete vehicle. Please try again.");
    },
  });

  // const pager: Pager = data?.pager;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearchParams({
      page: "1", // Reset to page 1 on new search
      search: newSearch,
      status,
    });
  };

  const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setSearchParams({
      page: "1",
      search,
      status: newStatus,
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      search,
      status,
    });
  };

  const handleDeleteClick = (vehicleId: string, vehicleBrand: string) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehicleName(vehicleBrand);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedVehicleId) {
      deleteVehicle(selectedVehicleId);
    }
  };

  return (
    <DashboardLayout pageTitle="Vehicles" breadcrumb="Dashboard · Vehicles">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Vehicle List
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage all registered operational vehicles.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => navigate("/dashboard/vehicles/create")}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
        {[
          {
            label: "All",
            count: data?.chip.all,
            color:
              "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600",
          },
          {
            label: "Available",
            count: data?.chip.available,
            color:
              "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
          },
          {
            label: "In Use",
            count: data?.chip.booked,
            color:
              "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
          },
          {
            label: "Maintenance",
            count: data?.chip.maintenance,
            color:
              "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
          },
        ].map((chip) => (
          <div
            key={chip.label}
            className={`text-[10px] sm:text-xs font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full ${chip.color}`}
          >
            {chip.label}: <span className="font-bold">{chip.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search name or plate..."
              value={search}
              onChange={handleSearch}
              className={`w-full pl-9 pr-4 py-2 ${inputClass}`}
            />
          </div>
          <select
            value={status}
            onChange={handleFilterStatus}
            className={`px-3 py-2 ${inputClass}`}
          >
            <option value="">All</option>
            {["available", "booked", "maintenance"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {/* <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto whitespace-nowrap">
             vehicles
          </span> */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                {[
                  "ID",
                  "Vehicle",
                  "Plate",
                  "Location",
                  "Type",
                  "Ownership",
                  "Year",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.data.map((vehicle: Vehicle) => {
                const i = data.data.indexOf(vehicle) + 1;
                return (
                  <tr
                    key={vehicle.id}
                    className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150 `}
                  >
                    <td className="px-5 py-3.5 font-mono text-amber-600 dark:text-amber-400 text-xs font-medium whitespace-nowrap">
                      {i}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                      {vehicle.vehicle_brand}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                      {vehicle.vehicle_number_plate}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {vehicle.location_name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {vehicle.vehicle_type}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {vehicle.vehicle_ownership}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      {vehicle.vehicle_year}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle[vehicle.vehicle_status]}`}
                      >
                        {vehicle.vehicle_status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/vehicles/${vehicle.id}`)}
                          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                          title="View Details"
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
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        <button
                          className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-150"
                          title="Edit"
                          onClick={() =>
                            navigate(`/dashboard/vehicles/${vehicle.id}/edit`)
                          }
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(vehicle.id, vehicle.vehicle_brand)
                          }
                          className="text-slate-400 hover:text-red-500 transition-colors duration-150"
                          title="Delete"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination pager={data?.pager} onPageChange={handlePageChange} />
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Vehicle"
        description={`Are you sure you want to delete "${selectedVehicleName}"? This action cannot be undone.`}
        variant="danger"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

export default Vehicles;
