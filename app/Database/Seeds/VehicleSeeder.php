<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'vehicle_brand' => 'Toyota Hilux',
                'vehicle_ownership' => 'owned',
                'vehicle_number_plate' => 'B1234AA',
                'vehicle_year' => 2022,
                'vehicle_type' => 'goods',
                'vehicle_status' => 'available',
                'vehicle_location' => 3
            ],
            [
                'vehicle_brand' => 'Toyota Avanza',
                'vehicle_ownership' => 'owned',
                'vehicle_number_plate' => 'B5678BB',
                'vehicle_year' => 2021,
                'vehicle_type' => 'humans',
                'vehicle_status' => 'available',
                'vehicle_location' => 1
            ],
            [
                'vehicle_brand' => 'Mitsubishi Triton',
                'vehicle_ownership' => 'rent',
                'vehicle_number_plate' => 'B1111CC',
                'vehicle_year' => 2023,
                'vehicle_type' => 'goods',
                'vehicle_status' => 'available',
                'vehicle_location' => 5
            ],
            [
                'vehicle_brand' => 'Isuzu Elf',
                'vehicle_ownership' => 'owned',
                'vehicle_number_plate' => 'B2222DD',
                'vehicle_year' => 2020,
                'vehicle_type' => 'humans',
                'vehicle_status' => 'available',
                'vehicle_location' => 2
            ],
            [
                'vehicle_brand' => 'Toyota Fortuner',
                'vehicle_ownership' => 'rent',
                'vehicle_number_plate' => 'B3333EE',
                'vehicle_year' => 2022,
                'vehicle_type' => 'humans',
                'vehicle_status' => 'available',
                'vehicle_location' => 4
            ],
        ];

        $this->db->table('vehicle')->insertBatch($data);
    }
}