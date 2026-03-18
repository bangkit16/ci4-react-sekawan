<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use Faker\Factory;

class DriverSeeder extends Seeder
{
    public function run()
    {
        $faker = Factory::create('id_ID');
        $data = [
            ['driver_name'=>$faker->name(),'driver_phone'=>$faker->phoneNumber()],
            ['driver_name'=>$faker->name(),'driver_phone'=>$faker->phoneNumber()],
            ['driver_name'=>$faker->name(),'driver_phone'=>$faker->phoneNumber()],
            ['driver_name'=>$faker->name(),'driver_phone'=>$faker->phoneNumber()],
            ['driver_name'=>$faker->name(),'driver_phone'=>$faker->phoneNumber()],
        ];

        $this->db->table('driver')->insertBatch($data);
    }
}