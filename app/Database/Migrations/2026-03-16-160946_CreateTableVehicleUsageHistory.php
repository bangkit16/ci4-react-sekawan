<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVehicleUsageHistory extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'=>[
                'type'=>'INT',
                'auto_increment'=>true
            ],
            'vehicle_id'=>[
                'type'=>'INT'
            ],
            'booking_id'=>[
                'type'=>'INT'
            ],
            'driver_id'=>[
                'type'=>'INT'
            ],
            'distance'=>[
                'type'=>'FLOAT'
            ],
            'start_time'=>[
                'type'=>'DATETIME'
            ],
            'end_time'=>[
                'type'=>'DATETIME'
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);

        $this->forge->addForeignKey('vehicle_id','vehicle','id');
        $this->forge->addForeignKey('booking_id','vehicle_booking','id');
        $this->forge->addForeignKey('driver_id','driver','id');

        $this->forge->createTable('vehicle_usage_history');
    }

    public function down()
    {
        $this->forge->dropTable('vehicle_usage_history');
    }
}