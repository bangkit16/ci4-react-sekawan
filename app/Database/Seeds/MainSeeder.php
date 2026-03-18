<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class MainSeeder extends Seeder
{
    public function run()
    {
        $this->call(RegionSeeder::class);
        $this->call(LocationSeeder::class);
        $this->call(VehicleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(DriverSeeder::class);
        $this->call(EmployeeSeeder::class);
        $this->call(BookingSeeder::class);
        $this->call(VehicleFuelSeeder::class);
        $this->call(VehicleUsageHistorySeeder::class);
        $this->call(VehicleMaintenanceSeeder::class);
    }
}
