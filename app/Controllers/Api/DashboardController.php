<?php

namespace App\Controllers\Api;

use App\Models\VehicleModel;
use App\Models\VehicleFuelModel;
use App\Models\VehicleUsageHistoryModel;
use App\Models\VehicleMaintenanceModel;
use App\Models\DriverModel;
use App\Models\VehicleBookingModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class DashboardController extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $vehicleModel = new VehicleModel();
        $fuelModel = new VehicleFuelModel();
        $usageModel = new VehicleUsageHistoryModel();
        $maintenanceModel = new VehicleMaintenanceModel();
        $bookingModel = new VehicleBookingModel();
        $driverModel = new DriverModel();

        // 1. Summary Stats
        $stats = [
            'total_vehicles' => $vehicleModel->countAllResults(),
            'total_drivers' => $driverModel->countAllResults(),
            'total_bookings' => $bookingModel->countAllResults(),
            'active_bookings' => $bookingModel->where('booking_status', 'approved')->countAllResults(),
        ];

        // 2. Vehicle Status Distribution (Pie Chart)
        $statusDistribution = $vehicleModel->select('vehicle_status, COUNT(*) as count')
            ->groupBy('vehicle_status')
            ->findAll();

        // 3. Monthly Costs (Fuel & Maintenance) - Last 6 months
        $db = \Config\Database::connect();
        
        $fuelMonthly = $db->table('vehicle_fuel')
            ->select("DATE_FORMAT(fuel_date, '%Y-%m') as month, SUM(fuel_price) as total_fuel")
            ->groupBy('month')
            ->orderBy('month', 'DESC')
            ->limit(6)
            ->get()
            ->getResultArray();

        $maintenanceMonthly = $db->table('vehicle_maintenance')
            ->select("DATE_FORMAT(service_date, '%Y-%m') as month, SUM(cost) as total_maintenance")
            ->groupBy('month')
            ->orderBy('month', 'DESC')
            ->limit(6)
            ->get()
            ->getResultArray();

        // 4. Monthly Usage (Distance)
        $usageMonthly = $db->table('vehicle_usage_history')
            ->select("DATE_FORMAT(start_time, '%Y-%m') as month, SUM(distance) as total_distance")
            ->groupBy('month')
            ->orderBy('month', 'DESC')
            ->limit(6)
            ->get()
            ->getResultArray();

        return $this->respond([
            'status' => 200,
            'data' => [
                'stats' => $stats,
                'statusDistribution' => $statusDistribution,
                'fuelMonthly' => array_reverse($fuelMonthly),
                'maintenanceMonthly' => array_reverse($maintenanceMonthly),
                'usageMonthly' => array_reverse($usageMonthly),
            ],
            'message' => 'Success get dashboard data'
        ]);
    }
}
