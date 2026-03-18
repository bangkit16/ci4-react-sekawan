import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "../../component/DashboardLayout";
import Button from "../../component/Button";
import { VehiclesService } from "../../services/vehicle";
import { BookingService } from "../../services/booking";
import { Modal } from "../../component/Modal";
import { useToastContext } from "../../utils/ToastContext";

// Schemas
const fuelSchema = z.object({
  fuel_amount: z.coerce.number().min(0.1, "Amount is required"),
  fuel_price: z.coerce.number().min(0, "Cost is required"),
  fuel_date: z.string().min(1, "Date is required"),
});

const usageSchema = z.object({
  driver_id: z.coerce.number().min(1, "Driver is required"),
  distance: z.coerce.number().min(0.1, "Distance is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().optional().or(z.literal('')),
});

const maintenanceSchema = z.object({
  service_date: z.string().min(1, "Service date is required"),
  description: z.string().min(1, "Description is required"),
  cost: z.coerce.number().min(0, "Cost is required"),
  next_service_date: z.string().min(1, "Next service date is required"),
});

const inputClass = "w-full border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all px-4 py-2.5";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const errorClass = "text-red-500 dark:text-red-400 text-xs mt-1";

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToastContext();

  // Modals state
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  const [editFuelId, setEditFuelId] = useState<string | null>(null);

  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [editUsageId, setEditUsageId] = useState<string | null>(null);

  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [editMaintenanceId, setEditMaintenanceId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ type: 'fuel' | 'usage' | 'maintenance', id: string } | null>(null);

  // Queries
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => VehiclesService.getVehicle(id!),
    enabled: !!id,
  });

  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => BookingService.getDrivers(),
  });

  const vehicle = responseData?.data;

  // Forms
  const fuelForm = useForm<z.infer<typeof fuelSchema>>({ resolver: zodResolver(fuelSchema) });
  const usageForm = useForm<z.infer<typeof usageSchema>>({ resolver: zodResolver(usageSchema) });
  const maintenanceForm = useForm<z.infer<typeof maintenanceSchema>>({ resolver: zodResolver(maintenanceSchema) });

  // Handlers for Opening Modals
  const openFuelModal = (fuel?: any) => {
    if (fuel) {
      setEditFuelId(fuel.id);
      fuelForm.reset({
        fuel_amount: fuel.fuel_amount,
        fuel_price: fuel.fuel_price,
        fuel_date: fuel.fuel_date ? fuel.fuel_date.split(' ')[0] : '',
      });
    } else {
      setEditFuelId(null);
      fuelForm.reset({ fuel_amount: undefined, fuel_price: undefined, fuel_date: '' } as any);
    }
    setFuelModalOpen(true);
  };

  const openUsageModal = (usage?: any) => {
    if (usage) {
      setEditUsageId(usage.id);
      usageForm.reset({
        driver_id: usage.driver_id,
        distance: usage.distance,
        start_time: usage.start_time ? usage.start_time.replace(' ', 'T').substring(0, 16) : '',
        end_time: usage.end_time ? usage.end_time.replace(' ', 'T').substring(0, 16) : '',
      });
    } else {
      setEditUsageId(null);
      usageForm.reset({ driver_id: undefined, distance: undefined, start_time: '', end_time: '' } as any);
    }
    setUsageModalOpen(true);
  };

  const openMaintenanceModal = (m?: any) => {
    if (m) {
      setEditMaintenanceId(m.id);
      maintenanceForm.reset({
        service_date: m.service_date ? m.service_date.split(' ')[0] : '',
        description: m.description,
        cost: m.cost,
        next_service_date: m.next_service_date ? m.next_service_date.split(' ')[0] : '',
      });
    } else {
      setEditMaintenanceId(null);
      maintenanceForm.reset({ service_date: '', description: '', cost: undefined, next_service_date: '' } as any);
    }
    setMaintenanceModalOpen(true);
  };

  const confirmDelete = (type: 'fuel' | 'usage' | 'maintenance', recordId: string) => {
    setDeleteConfig({ type, id: recordId });
    setDeleteModalOpen(true);
  };

  // Mutations
  const onSaveFuel = useMutation({
    mutationFn: (data: z.infer<typeof fuelSchema>) => 
      editFuelId ? VehiclesService.updateFuelRecord(editFuelId, data) : VehiclesService.createFuelRecord({ ...data, vehicle_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
      setFuelModalOpen(false);
      toast.success(editFuelId ? "Fuel record updated." : "Fuel record added.");
    }
  });

  const onSaveUsage = useMutation({
    mutationFn: (data: z.infer<typeof usageSchema>) => 
      editUsageId ? VehiclesService.updateUsageRecord(editUsageId, data) : VehiclesService.createUsageRecord({ ...data, vehicle_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
      setUsageModalOpen(false);
      toast.success(editUsageId ? "Usage record updated." : "Usage record added.");
    }
  });

  const onSaveMaintenance = useMutation({
    mutationFn: (data: z.infer<typeof maintenanceSchema>) => 
      editMaintenanceId ? VehiclesService.updateMaintenanceRecord(editMaintenanceId, data) : VehiclesService.createMaintenanceRecord({ ...data, vehicle_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
      setMaintenanceModalOpen(false);
      toast.success(editMaintenanceId ? "Maintenance record updated." : "Maintenance record added.");
    }
  });

  const onDeleteRecord = useMutation({
    mutationFn: (config: { type: string, id: string }) => {
      if (config.type === 'fuel') return VehiclesService.deleteFuelRecord(config.id);
      if (config.type === 'usage') return VehiclesService.deleteUsageRecord(config.id);
      return VehiclesService.deleteMaintenanceRecord(config.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
      setDeleteModalOpen(false);
      setDeleteConfig(null);
      toast.success(`Record deleted successfully.`);
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Vehicle Details" breadcrumb="Dashboard · Vehicles · Detail">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading vehicle details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !vehicle) {
    return (
      <DashboardLayout pageTitle="Vehicle Details" breadcrumb="Dashboard · Vehicles · Detail">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-500">Failed to load vehicle details.</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Available</span>;
      case "booked":
        return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Booked</span>;
      case "maintenance":
        return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Maintenance</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  const ActionButtons = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => (
    <div className="flex items-center justify-end gap-2">
      <button onClick={onEdit} className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors" title="Edit">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </button>
      <button onClick={onDelete} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );

  return (
    <DashboardLayout pageTitle="Vehicle Details" breadcrumb="Dashboard · Vehicles · Detail">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white truncate">
              {vehicle.vehicle_brand} ({vehicle.vehicle_number_plate})
            </h2>
            {getStatusBadge(vehicle.vehicle_status)}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Detailed view of vehicle information and history logs.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => navigate(-1)}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-3 mb-4">
              Vehicle Information
            </h3>
            <div className="space-y-4">
              <div><span className="block text-xs text-slate-500">Brand / Model</span><span className="font-medium text-slate-800 dark:text-white">{vehicle.vehicle_brand}</span></div>
              <div><span className="block text-xs text-slate-500">Number Plate</span><span className="font-mono text-amber-600 dark:text-amber-400 text-sm font-medium">{vehicle.vehicle_number_plate}</span></div>
              <div><span className="block text-xs text-slate-500">Year</span><span className="text-slate-700 dark:text-slate-300">{vehicle.vehicle_year}</span></div>
              <div><span className="block text-xs text-slate-500">Type</span><span className="text-slate-700 dark:text-slate-300">{vehicle.vehicle_type === 'humans' ? 'Passenger (Humans)' : 'Cargo (Goods)'}</span></div>
              <div><span className="block text-xs text-slate-500">Ownership</span><span className="text-slate-700 dark:text-slate-300 capitalize">{vehicle.vehicle_ownership}</span></div>
              <div><span className="block text-xs text-slate-500">Current Location</span><span className="text-slate-700 dark:text-slate-300">{vehicle.location_name || 'N/A'}</span></div>
            </div>
          </div>
        </div>

        {/* History Tabs / Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Fuel History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Fuel Usage History</h3>
              <Button size="sm" className="w-full sm:w-auto" onClick={() => openFuelModal()}>Add Fuel</Button>
            </div>
            {vehicle.fuels && vehicle.fuels.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Cost (IDR)</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {vehicle.fuels.map((fuel) => (
                      <tr key={fuel.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-3">{new Date(fuel.fuel_date).toLocaleDateString()}</td>
                        <td className="px-6 py-3">{fuel.fuel_amount} L</td>
                        <td className="px-6 py-3">Rp {Number(fuel.fuel_price).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-3 text-right">
                          <ActionButtons onEdit={() => openFuelModal(fuel)} onDelete={() => confirmDelete('fuel', fuel.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="p-6 text-center text-slate-500">No fuel records found.</div>}
          </div>

          {/* Usage History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Vehicle Usage History</h3>
              <Button size="sm" className="w-full sm:w-auto" onClick={() => openUsageModal()}>Add Usage</Button>
            </div>
            {vehicle.usages && vehicle.usages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-3">Driver</th>
                      <th className="px-6 py-3">Distance</th>
                      <th className="px-6 py-3">Start Time</th>
                      <th className="px-6 py-3">End Time</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {vehicle.usages.map((usage) => (
                      <tr key={usage.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-3">{usage.driver_name || 'Self Drive'}</td>
                        <td className="px-6 py-3">{usage.distance} KM</td>
                        <td className="px-6 py-3">{new Date(usage.start_time).toLocaleString()}</td>
                        <td className="px-6 py-3">{usage.end_time ? new Date(usage.end_time).toLocaleString() : 'In Progress'}</td>
                        <td className="px-6 py-3 text-right">
                          <ActionButtons onEdit={() => openUsageModal(usage)} onDelete={() => confirmDelete('usage', usage.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="p-6 text-center text-slate-500">No usage history found.</div>}
          </div>

          {/* Maintenance History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Maintenance History</h3>
              <Button size="sm" className="w-full sm:w-auto" onClick={() => openMaintenanceModal()}>Add Maintenance</Button>
            </div>
            {vehicle.maintenances && vehicle.maintenances.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Cost (IDR)</th>
                      <th className="px-6 py-3">Next Service</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {vehicle.maintenances.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-3">{new Date(m.service_date).toLocaleDateString()}</td>
                        <td className="px-6 py-3">{m.description}</td>
                        <td className="px-6 py-3">Rp {Number(m.cost).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-3">{new Date(m.next_service_date).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-right">
                          <ActionButtons onEdit={() => openMaintenanceModal(m)} onDelete={() => confirmDelete('maintenance', m.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="p-6 text-center text-slate-500">No maintenance records found.</div>}
          </div>

        </div>
      </div>

      {/* Fuel Modal */}
      <Modal isOpen={fuelModalOpen} title={`${editFuelId ? 'Edit' : 'Add'} Fuel Record`} onClose={() => setFuelModalOpen(false)} onConfirm={fuelForm.handleSubmit((d) => onSaveFuel.mutate(d))} cancelText="Cancel" confirmText="Save Record" variant="default" isLoading={onSaveFuel.isPending}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Liters</label>
            <input type="number" step="0.1" {...fuelForm.register("fuel_amount")} className={inputClass} />
            {fuelForm.formState.errors.fuel_amount && <span className={errorClass}>{fuelForm.formState.errors.fuel_amount.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Total Cost (IDR)</label>
            <input type="number" {...fuelForm.register("fuel_price")} className={inputClass} />
            {fuelForm.formState.errors.fuel_price && <span className={errorClass}>{fuelForm.formState.errors.fuel_price.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" {...fuelForm.register("fuel_date")} className={inputClass} />
            {fuelForm.formState.errors.fuel_date && <span className={errorClass}>{fuelForm.formState.errors.fuel_date.message}</span>}
          </div>
        </div>
      </Modal>

      {/* Usage Modal */}
      <Modal isOpen={usageModalOpen} title={`${editUsageId ? 'Edit' : 'Add'} Usage Record`} onClose={() => setUsageModalOpen(false)} onConfirm={usageForm.handleSubmit((d) => onSaveUsage.mutate(d))} cancelText="Cancel" confirmText="Save Record" variant="default" isLoading={onSaveUsage.isPending}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Driver</label>
            <select {...usageForm.register("driver_id")} className={inputClass}>
              <option value="">Select Driver</option>
              {drivers?.map((d: any) => <option key={d.id} value={d.id}>{d.driver_name}</option>)}
            </select>
            {usageForm.formState.errors.driver_id && <span className={errorClass}>{usageForm.formState.errors.driver_id.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Distance (KM)</label>
            <input type="number" step="0.1" {...usageForm.register("distance")} className={inputClass} />
            {usageForm.formState.errors.distance && <span className={errorClass}>{usageForm.formState.errors.distance.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Start Time</label>
            <input type="datetime-local" {...usageForm.register("start_time")} className={inputClass} />
            {usageForm.formState.errors.start_time && <span className={errorClass}>{usageForm.formState.errors.start_time.message}</span>}
          </div>
          <div>
            <label className={labelClass}>End Time (Optional)</label>
            <input type="datetime-local" {...usageForm.register("end_time")} className={inputClass} />
            {usageForm.formState.errors.end_time && <span className={errorClass}>{usageForm.formState.errors.end_time.message}</span>}
          </div>
        </div>
      </Modal>

      {/* Maintenance Modal */}
      <Modal isOpen={maintenanceModalOpen} title={`${editMaintenanceId ? 'Edit' : 'Add'} Maintenance`} onClose={() => setMaintenanceModalOpen(false)} onConfirm={maintenanceForm.handleSubmit((d) => onSaveMaintenance.mutate(d))} cancelText="Cancel" confirmText="Save Record" variant="default" isLoading={onSaveMaintenance.isPending}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Service Date</label>
            <input type="date" {...maintenanceForm.register("service_date")} className={inputClass} />
            {maintenanceForm.formState.errors.service_date && <span className={errorClass}>{maintenanceForm.formState.errors.service_date.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea {...maintenanceForm.register("description")} className={inputClass} rows={2} />
            {maintenanceForm.formState.errors.description && <span className={errorClass}>{maintenanceForm.formState.errors.description.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Cost (IDR)</label>
            <input type="number" {...maintenanceForm.register("cost")} className={inputClass} />
            {maintenanceForm.formState.errors.cost && <span className={errorClass}>{maintenanceForm.formState.errors.cost.message}</span>}
          </div>
          <div>
            <label className={labelClass}>Next Service Date</label>
            <input type="date" {...maintenanceForm.register("next_service_date")} className={inputClass} />
            {maintenanceForm.formState.errors.next_service_date && <span className={errorClass}>{maintenanceForm.formState.errors.next_service_date.message}</span>}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModalOpen} 
        title="Delete Record" 
        description="Are you sure you want to delete this record? This action cannot be undone."
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={() => {
          if (deleteConfig) onDeleteRecord.mutate(deleteConfig);
        }} 
        cancelText="Cancel" 
        confirmText="Delete" 
        variant="danger" 
        isLoading={onDeleteRecord.isPending}
      />
    </DashboardLayout>
  );
}
