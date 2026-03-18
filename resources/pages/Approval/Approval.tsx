import { useState } from "react";
import DashboardLayout from "../../component/DashboardLayout";
import Pagination from "../../component/Pagination";
import { Modal } from "../../component/Modal";

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  Approved: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
  Rejected: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
};

const inputClass =
  "border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all";

const dummyApprovals = [
  { id: 'AP-0105', bookingId: 'BK-0092', requester: 'Siti Aminah', vehicleType: 'Passenger', route: 'HQ → Site A', date: '18 Mar 2026', status: 'Pending' },
  { id: 'AP-0104', bookingId: 'BK-0091', requester: 'Joko Widodo', vehicleType: 'Cargo', route: 'Site B → Kantor Cabang', date: '17 Mar 2026', status: 'Approved' },
  { id: 'AP-0103', bookingId: 'BK-0088', requester: 'Megawati', vehicleType: 'Passenger', route: 'Kantor Cabang → Site D', date: '15 Mar 2026', status: 'Rejected' },
];

function Approval() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"approve" | "reject">("approve");
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);

  const handleActionClick = (id: string, type: "approve" | "reject") => {
    setSelectedApprovalId(id);
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <DashboardLayout pageTitle="Approvals" breadcrumb="Dashboard · Approvals">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Approval Requests
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Review and manage vehicle booking requests assigned to you.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: "Needs Action", count: 1, color: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20" },
          { label: "Previously Approved", count: 42, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20" },
          { label: "Previously Rejected", count: 8, color: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20" },
        ].map((chip) => (
          <div key={chip.label} className={`text-xs font-medium px-3 py-1.5 rounded-full ${chip.color}`}>
            {chip.label}: <span className="font-bold">{chip.count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search approvals..." className={`w-full pl-9 pr-4 py-2 ${inputClass}`} />
          </div>
          <select className={`px-3 py-2 ${inputClass}`}>
            <option value="">All Status</option>
            {["Pending", "Approved", "Rejected"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                {["Approval ID", "Booking Ref", "Requester", "Vehicle Type", "Route", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dummyApprovals.map((ap) => (
                <tr key={ap.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150 border-b border-gray-100 dark:border-slate-700 last:border-0">
                  <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-400 text-xs font-medium whitespace-nowrap">{ap.id}</td>
                  <td className="px-5 py-3.5 font-mono text-amber-600 dark:text-amber-400 text-xs font-medium whitespace-nowrap">{ap.bookingId}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white whitespace-nowrap">{ap.requester}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">{ap.vehicleType}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{ap.route}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">{ap.date}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle[ap.status]}`}>
                      {ap.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {ap.status === 'Pending' ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleActionClick(ap.id, "approve")} className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                          Approve
                        </button>
                        <button onClick={() => handleActionClick(ap.id, "reject")} className="text-red-600 hover:text-red-700 font-medium transition-colors">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">No action needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination pager={{ current_page: 1, total_pages: 1, total_items: 3, has_next: false, has_prev: false, get_first: 1, get_last: 3 }} onPageChange={() => {}} />
      </div>

      <Modal
        isOpen={modalOpen}
        title={modalType === "approve" ? "Approve Request" : "Reject Request"}
        description={`Are you sure you want to ${modalType} request ${selectedApprovalId}?`}
        variant={modalType === "approve" ? "default" : "danger"}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        confirmText={modalType === "approve" ? "Confirm Approve" : "Confirm Reject"}
        cancelText="Cancel"
      />
    </DashboardLayout>
  );
}

export default Approval;
