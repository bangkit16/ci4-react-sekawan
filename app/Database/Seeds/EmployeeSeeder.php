<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use Faker\Factory;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        $faker = Factory::create('id_ID');
        $data = [
            ['employee_name' => $faker->name(), 'employee_phone' => $faker->phoneNumber()],
            ['employee_name' => $faker->name(), 'employee_phone' => $faker->phoneNumber()],
            ['employee_name' => $faker->name(), 'employee_phone' => $faker->phoneNumber()],
            ['employee_name' => $faker->name(), 'employee_phone' => $faker->phoneNumber()],
            ['employee_name' => $faker->name(), 'employee_phone' => $faker->phoneNumber()],
            ['employee_name' => $faker->name(), 'employee_phone' => $faker->phoneNumber()],
            ['employee_name' => $faker->name(), 'employee_phone' => $faker->phoneNumber()],
        ];

        $this->db->table('employee')->insertBatch($data);
    }
}
