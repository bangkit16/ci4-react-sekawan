<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['region_name' => 'Jakarta'],
            ['region_name' => 'Surabaya'],
            ['region_name' => 'Bandung'],
            ['region_name' => 'Makassar'],
            ['region_name' => 'Balikpapan'],
        ];

        $this->db->table('region')->insertBatch($data);
    }
}