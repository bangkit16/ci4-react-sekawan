<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class VehicleMaintenanceSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Vehicle 1
            [
                'vehicle_id' => 1,
                'service_date' => date('Y-m-d', strtotime('-30 days')),
                'description' => 'Oil change and filter replacement',
                'cost' => 250000.00,
                'next_service_date' => date('Y-m-d', strtotime('+60 days')),
            ],
            [
                'vehicle_id' => 1,
                'service_date' => date('Y-m-d', strtotime('-60 days')),
                'description' => 'Tire rotation and balance',
                'cost' => 350000.00,
                'next_service_date' => date('Y-m-d', strtotime('+180 days')),
            ],
            // Vehicle 2
            [
                'vehicle_id' => 2,
                'service_date' => date('Y-m-d', strtotime('-15 days')),
                'description' => 'Brake pad replacement',
                'cost' => 450000.00,
                'next_service_date' => date('Y-m-d', strtotime('+120 days')),
            ],
            [
                'vehicle_id' => 2,
                'service_date' => date('Y-m-d', strtotime('-45 days')),
                'description' => 'Battery check and replacement',
                'cost' => 550000.00,
                'next_service_date' => date('Y-m-d', strtotime('+365 days')),
            ],
            [
                'vehicle_id' => 2,
                'service_date' => date('Y-m-d', strtotime('-90 days')),
                'description' => 'Transmission fluid change',
                'cost' => 750000.00,
                'next_service_date' => date('Y-m-d', strtotime('+365 days')),
            ],
            // Vehicle 3
            [
                'vehicle_id' => 3,
                'service_date' => date('Y-m-d', strtotime('-20 days')),
                'description' => 'Air filter replacement',
                'cost' => 150000.00,
                'next_service_date' => date('Y-m-d', strtotime('+180 days')),
            ],
            [
                'vehicle_id' => 3,
                'service_date' => date('Y-m-d', strtotime('-50 days')),
                'description' => 'Suspension service',
                'cost' => 900000.00,
                'next_service_date' => date('Y-m-d', strtotime('+365 days')),
            ],
            [
                'vehicle_id' => 3,
                'service_date' => date('Y-m-d', strtotime('-10 days')),
                'description' => 'Windshield wiper replacement',
                'cost' => 100000.00,
                'next_service_date' => date('Y-m-d', strtotime('+180 days')),
            ],
        ];

        $this->db->table('vehicle_maintenance')->insertBatch($data);
    }
}
