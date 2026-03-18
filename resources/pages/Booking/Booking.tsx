import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import Pagination from "../../component/Pagination";
import { Modal } from "../../component/Modal";
import { BookingService, type ApprovalDetail } from "../../services/booking";
import { useQuery } from "@tanstack/react-query";

const statusStyle: Record<string, string> = {
  pending:
    "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  "approve:level1":
    "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20",
  "approve:level2":
    "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
  "rejected:level1":
    "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
  "rejected:level2":
    "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
};

const inputClass =
  "border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all";

interface BookingVehicle {
  id: string;
  vehicle_brand: string;
  driver_name: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  booking_status:
    | "pending"
    | "approve:level1"
    | "approve:level2"
    | "rejected:level1"
    | "rejected:level2";
}
function Booking() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [approvals, setApprovals] = useState<ApprovalDetail[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  const { data } = useQuery({
    queryKey: ["bookings", currentPage, search, statusFilter],
    queryFn: () =>
      BookingService.getBookings({
        page: currentPage,
        search,
        status: statusFilter,
      }),
  });

  const handleDetailClick = async (id: string) => {
    setLoadingApprovals(true);
    try {
      const response = await BookingService.getApprovals(parseInt(id));
      setApprovals(response.data || []);
    } catch (error) {
      setApprovals([]);
    } finally {
      setLoadingApprovals(false);
      setDetailModalOpen(true);
    }
  };

  const bookings = data?.data || [];
  const pager = data?.pager || {};
  return (
    <DashboardLayout pageTitle="Bookings" breadcrumb="Dashboard · Bookings">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Booking List
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage vehicle booking requests.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => navigate("/dashboard/bookings/create")}
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
            New Booking
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        {[
          {
            label: "All Bookings",
            count: data?.chip.all,
            color:
              "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600",
          },
          {
            label: "Pending",
            count: data?.chip.pending,
            color:
              "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
          },
          {
            label: "Approved L1",
            count: data?.chip["approve:level1"],
            color:
              "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20",
          },
          {
            label: "Approved L2",
            count: data?.chip["approve:level2"],
            color:
              "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
          },
          {
            label: "Rejected L1",
            count: data?.chip["rejected:level1"],
            color:
              "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
          },
          {
            label: "Rejected L2",
            count: data?.chip["rejected:level2"],
            color:
              "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
          },
        ].map((chip) => (
          <div
            key={chip.label}
            className={`text-xs font-medium px-3 py-1.5 rounded-full ${chip.color}`}
          >
            {chip.label}: <span className="font-bold">{chip.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
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
              placeholder="Search booking..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full pl-9 pr-4 py-2 ${inputClass}`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-2 ${inputClass}`}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approve:level1">Approved L1</option>
            <option value="approve:level2">Approved L2</option>
            <option value="rejected:level1">Rejected L1</option>
            <option value="rejected:level2">Rejected L2</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                {[
                  "Booking ID",
                  "Vehicle",
                  "Driver",
                  "Employee",
                  "Start Date",
                  "End Date",
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
              {bookings.map((bk: BookingVehicle) => (
                <tr
                  key={bk.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150 border-b border-gray-100 dark:border-slate-700 last:border-0"
                >
                  <td className="px-5 py-3.5 font-mono text-amber-600 dark:text-amber-400 text-xs font-medium whitespace-nowrap">
                    {bk.id}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                    {bk.vehicle_brand}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {bk.driver_name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {bk.employee_name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {bk.start_date}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {bk.end_date}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle[bk.booking_status]}`}
                    >
                      {bk.booking_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDetailClick(bk.id)}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          pager={{
            current_page: pager.current_page || 1,
            total_pages: pager.total_pages || 1,
            total_items: pager.total_items || 0,
            has_next: pager.has_next || false,
            has_prev: pager.has_prev || false,
            get_first: pager.get_first || 1,
            get_last: pager.get_last || 10,
          }}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      </div>

      {/* Detail Modal - Approval Information */}
      <Modal
        isOpen={detailModalOpen}
        title="Booking Approvals"
        variant="success"
        onClose={() => {
          setDetailModalOpen(false);
          setApprovals([]);
        }}
        onConfirm={() => {
          setDetailModalOpen(false);
          setApprovals([]);
        }}
        confirmText="Close"
        cancelText=""
      >
        {loadingApprovals ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              Loading approvals...
            </p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              No approval data found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">
                      Approval Level {approval.level}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {approval.approver_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {approval.approver_email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      approval.approval_status === "pending"
                        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                        : approval.approval_status === "accepted"
                          ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20"
                          : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20"
                    }`}
                  >
                    {approval.approval_status}
                  </span>
                </div>
                {approval.approve_date && (
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Approved: {new Date(approval.approve_date).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default Booking;
