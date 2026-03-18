import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "../../component/DashboardLayout";
import { Modal } from "../../component/Modal";
import { BookingService, type Approval } from "../../services/booking";
import { useToastContext } from "../../utils/ToastContext";

const statusStyle: Record<string, string> = {
  pending:
    "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  accepted:
    "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
  rejected:
    "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
  "approve:level1":
    "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20",
  "approve:level2":
    "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
  "rejected:level1":
    "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
  "rejected:level2":
    "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
};

const levelBadge: Record<number, string> = {
  1: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20",
  2: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20",
};

function Approvals() {
  const toast = useToastContext();
  const queryClient = useQueryClient();
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Fetch approvals
  const { data, isLoading } = useQuery({
    queryKey: ["approvals"],
    queryFn: () => BookingService.getMyApprovals(),
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (approvalId: number) =>
      BookingService.approveBooking(approvalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setAcceptModalOpen(false);
      setSelectedApproval(null);
    },
    onError: (error: any) => {
      toast.error(
        "Failed to approve: " +
          (error.response?.data?.message || error.message),
      );
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (approvalId: number) =>
      BookingService.rejectBooking(approvalId, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setRejectModalOpen(false);
      setSelectedApproval(null);
      setRejectReason("");
    },
    onError: (error: any) => {
      toast.error(
        "Failed to reject: " + (error.response?.data?.message || error.message),
      );
    },
  });

  const approvals = data?.data || [];

  const handleAccept = (approval: Approval) => {
    setSelectedApproval(approval);
    setAcceptModalOpen(true);
  };

  const handleReject = (approval: Approval) => {
    setSelectedApproval(approval);
    setRejectModalOpen(true);
  };

  const confirmAccept = () => {
    if (selectedApproval) {
      approveMutation.mutate(selectedApproval.id);
    }
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast.warning("Please provide a rejection reason");
      return;
    }
    if (selectedApproval) {
      rejectMutation.mutate(selectedApproval.id);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Booking Approvals"
      breadcrumb="Dashboard · Approvals"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            Pending Approvals
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Review and approve vehicle booking requests.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        {/* Approval Count */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-white">
              {approvals.length}
            </span>{" "}
            pending approvals
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                {[
                  "Vehicle",
                  "Driver",
                  "Requester",
                  "Level",
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Loading approvals...
                  </td>
                </tr>
              ) : approvals.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No pending approvals
                  </td>
                </tr>
              ) : (
                approvals.map((approval: Approval) => (
                  <tr
                    key={approval.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150 border-b border-gray-100 dark:border-slate-700 last:border-0"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                      {approval.vehicle_brand} ({approval.vehicle_number_plate})
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {approval.driver_name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {approval.employee_name}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${levelBadge[approval.level]}`}
                      >
                        Level {approval.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle[approval.approval_status]}`}
                      >
                        {approval.approval_status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAccept(approval)}
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                          className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-150 disabled:opacity-50"
                          title="Accept"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleReject(approval)}
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                          className="text-slate-400 hover:text-red-500 transition-colors duration-150 disabled:opacity-50"
                          title="Reject"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accept Modal */}
      <Modal
        isOpen={acceptModalOpen}
        title="Approve Booking"
        description={
          selectedApproval
            ? `Are you sure you want to approve this booking for ${selectedApproval.vehicle_brand}?`
            : ""
        }
        variant="success"
        onClose={() => {
          setAcceptModalOpen(false);
          setSelectedApproval(null);
        }}
        onConfirm={confirmAccept}
        confirmText={approveMutation.isPending ? "Approving..." : "Approve"}
        cancelText="Cancel"
      />

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        title="Reject Booking"
        variant="danger"
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedApproval(null);
          setRejectReason("");
        }}
        onConfirm={confirmReject}
        confirmText={rejectMutation.isPending ? "Rejecting..." : "Reject"}
        cancelText="Cancel"
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Reason for Rejection *
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejecting this booking..."
            rows={4}
            className="w-full border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all px-4 py-2.5"
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default Approvals;
