import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationsService } from "../../services/location";
import useDebounce from "../../hooks/useDebounce";
import Pagination from "../../component/Pagination";
import { Modal } from "../../component/Modal";
import { useToastContext } from "../../utils/ToastContext";

type Location = {
  id: string;
  location_name: string;
  address: string;
  type: string;
  region_name: string;
};

const inputClass =
  "border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all";

function Locations() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>("");

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  const debouncedSearch = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["locations", page, debouncedSearch],
    queryFn: () =>
      LocationsService.getLocations({
        page,
        search: debouncedSearch,
      }),
  });

  const { mutate: deleteLocation, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => LocationsService.deleteLocation(id),
    onSuccess: () => {
      toast.success("Location deleted successfully!");
      setDeleteModalOpen(false);
      setSelectedLocationId(null);
      setSelectedLocationName("");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: () => {
      toast.error("Failed to delete location. Please try again.");
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearchParams({
      page: "1",
      search: newSearch,
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      search,
    });
  };

  const handleDeleteClick = (locationId: string, locationName: string) => {
    setSelectedLocationId(locationId);
    setSelectedLocationName(locationName);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedLocationId) {
      deleteLocation(selectedLocationId);
    }
  };

  return (
    <DashboardLayout pageTitle="Locations" breadcrumb="Dashboard · Locations">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Location List
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage operational locations and sites.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => navigate("/dashboard/locations/create")}
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
            Add Location
          </Button>
        </div>
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
              placeholder="Search name or address..."
              value={search}
              onChange={handleSearch}
              className={`w-full pl-9 pr-4 py-2 ${inputClass}`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                {["ID", "Location Name" , "Region", "Type", "Address", "Actions"].map((h) => (
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
              {data?.data.map((location: Location) => {
                const i = data.data.indexOf(location) + 1;
                return (
                  <tr
                    key={location.id}
                    className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150`}
                  >
                    <td className="px-5 py-3.5 font-mono text-amber-600 dark:text-amber-400 text-xs font-medium whitespace-nowrap">
                      {i}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                      {location.location_name}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                      {location.region_name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap capitalize">
                      {location.type}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      {location.address}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/locations/${location.id}/edit`)
                          }
                          className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-150"
                          title="Edit"
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
                            handleDeleteClick(location.id, location.location_name)
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
        title="Delete Location"
        description={`Are you sure you want to delete "${selectedLocationName}"? This action cannot be undone.`}
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

export default Locations;
