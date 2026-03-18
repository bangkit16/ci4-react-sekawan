<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTimestampsToVehicleLogs extends Migration
{
    public function up()
    {
        $fields = [
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ];
        $this->forge->addColumn('vehicle_fuel', $fields);
        $this->forge->addColumn('vehicle_usage_history', $fields);
        $this->forge->addColumn('vehicle_maintenance', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('vehicle_fuel', 'updated_at');
        $this->forge->dropColumn('vehicle_usage_history', 'updated_at');
        $this->forge->dropColumn('vehicle_maintenance', 'updated_at');
    }
}
