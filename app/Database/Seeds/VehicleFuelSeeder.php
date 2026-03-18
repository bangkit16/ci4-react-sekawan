<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class VehicleFuelSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Vehicle 1
            [
                'vehicle_id' => 1,
                'booking_id' => 1,
                'fuel_amount' => 50.5,
                'fuel_price' => 9500.00,
                'fuel_date' => date('Y-m-d', strtotime('+1 day')),
            ],
            [
                'vehicle_id' => 1,
                'booking_id' => 1,
                'fuel_amount' => 45.0,
                'fuel_price' => 9600.00,
                'fuel_date' => date('Y-m-d', strtotime('+2 day')),
            ],
            // Vehicle 2
            [
                'vehicle_id' => 2,
                'booking_id' => 2,
                'fuel_amount' => 55.0,
                'fuel_price' => 9500.00,
                'fuel_date' => date('Y-m-d', strtotime('+3 day')),
            ],
            [
                'vehicle_id' => 2,
                'booking_id' => 2,
                'fuel_amount' => 48.5,
                'fuel_price' => 9550.00,
                'fuel_date' => date('Y-m-d', strtotime('+4 day')),
            ],
            [
                'vehicle_id' => 2,
                'booking_id' => 2,
                'fuel_amount' => 52.0,
                'fuel_price' => 9600.00,
                'fuel_date' => date('Y-m-d', strtotime('+5 day')),
            ],
            // Vehicle 3
            [
                'vehicle_id' => 3,
                'booking_id' => 3,
                'fuel_amount' => 60.0,
                'fuel_price' => 9500.00,
                'fuel_date' => date('Y-m-d', strtotime('+5 day')),
            ],
            [
                'vehicle_id' => 3,
                'booking_id' => 3,
                'fuel_amount' => 58.5,
                'fuel_price' => 9550.00,
                'fuel_date' => date('Y-m-d', strtotime('+6 day')),
            ],
        ];

        $this->db->table('vehicle_fuel')->insertBatch($data);
    }
}
