<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'region_id' => 1,
                'location_name' => 'Head Office Jakarta',
                'address' => 'Jakarta',
                'type' => 'hq'
            ],
            [
                'region_id' => 2,
                'location_name' => 'Branch Surabaya',
                'address' => 'Surabaya',
                'type' => 'branch'
            ],
            [
                'region_id' => 3,
                'location_name' => 'Tambang Bandung 1',
                'address' => 'Bandung',
                'type' => 'mine'
            ],
            [
                'region_id' => 3,
                'location_name' => 'Tambang Bandung 2',
                'address' => 'Bandung',
                'type' => 'mine'
            ],
            [
                'region_id' => 4,
                'location_name' => 'Tambang Makassar 1',
                'address' => 'Makassar',
                'type' => 'mine'
            ],
            [
                'region_id' => 4,
                'location_name' => 'Tambang Makassar 2',
                'address' => 'Makassar',
                'type' => 'mine'
            ],
            [
                'region_id' => 5,
                'location_name' => 'Tambang Balikpapan 1',
                'address' => 'Balikpapan',
                'type' => 'mine'
            ],
            [
                'region_id' => 5,
                'location_name' => 'Tambang Balikpapan 2',
                'address' => 'Balikpapan',
                'type' => 'mine'
            ],
        ];

        $this->db->table('location')->insertBatch($data);
    }
}