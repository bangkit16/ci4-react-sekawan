<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class VehicleUsageHistorySeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Vehicle 1 usage
            [
                'vehicle_id' => 1,
                'booking_id' => 1,
                'driver_id' => 1,
                'distance' => 150.5,
                'start_time' => date('Y-m-d H:i:s', strtotime('+1 day 08:00')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+1 day 12:30')),
            ],
            [
                'vehicle_id' => 1,
                'booking_id' => 1,
                'driver_id' => 1,
                'distance' => 120.0,
                'start_time' => date('Y-m-d H:i:s', strtotime('+2 day 09:00')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+2 day 13:15')),
            ],
            // Vehicle 2 usage
            [
                'vehicle_id' => 2,
                'booking_id' => 2,
                'driver_id' => 2,
                'distance' => 200.0,
                'start_time' => date('Y-m-d H:i:s', strtotime('+3 day 07:00')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+3 day 12:45')),
            ],
            [
                'vehicle_id' => 2,
                'booking_id' => 2,
                'driver_id' => 2,
                'distance' => 175.5,
                'start_time' => date('Y-m-d H:i:s', strtotime('+4 day 08:30')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+4 day 14:00')),
            ],
            [
                'vehicle_id' => 2,
                'booking_id' => 2,
                'driver_id' => 2,
                'distance' => 190.0,
                'start_time' => date('Y-m-d H:i:s', strtotime('+5 day 07:30')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+5 day 13:30')),
            ],
            // Vehicle 3 usage
            [
                'vehicle_id' => 3,
                'booking_id' => 3,
                'driver_id' => 3,
                'distance' => 250.0,
                'start_time' => date('Y-m-d H:i:s', strtotime('+5 day 06:00')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+5 day 12:00')),
            ],
            [
                'vehicle_id' => 3,
                'booking_id' => 3,
                'driver_id' => 3,
                'distance' => 220.5,
                'start_time' => date('Y-m-d H:i:s', strtotime('+6 day 07:00')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+6 day 13:30')),
            ],
            [
                'vehicle_id' => 3,
                'booking_id' => 3,
                'driver_id' => 3,
                'distance' => 210.0,
                'start_time' => date('Y-m-d H:i:s', strtotime('+6 day 14:00')),
                'end_time' => date('Y-m-d H:i:s', strtotime('+6 day 18:30')),
            ],
        ];

        $this->db->table('vehicle_usage_history')->insertBatch($data);
    }
}
