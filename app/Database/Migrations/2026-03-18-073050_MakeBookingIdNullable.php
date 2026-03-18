<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class MakeBookingIdNullable extends Migration
{
    public function up()
    {
        $this->forge->modifyColumn('vehicle_fuel', [
            'booking_id' => [
                'type' => 'INT',
                'null' => true,
            ],
        ]);

        $this->forge->modifyColumn('vehicle_usage_history', [
            'booking_id' => [
                'type' => 'INT',
                'null' => true,
            ],
        ]);
    }

    public function down()
    {
        $this->forge->modifyColumn('vehicle_fuel', [
            'booking_id' => [
                'type' => 'INT',
                'null' => false,
            ],
        ]);

        $this->forge->modifyColumn('vehicle_usage_history', [
            'booking_id' => [
                'type' => 'INT',
                'null' => false,
            ],
        ]);
    }
}
