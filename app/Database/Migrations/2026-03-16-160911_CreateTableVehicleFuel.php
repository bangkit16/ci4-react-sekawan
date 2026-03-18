<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVehicleFuel extends Migration
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
            'fuel_amount'=>[
                'type'=>'FLOAT'
            ],
            'fuel_price'=>[
                'type'=>'DECIMAL',
                'constraint'=>'12,2'
            ],
            'fuel_date'=>[
                'type'=>'DATE'
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);

        $this->forge->addForeignKey('vehicle_id','vehicle','id');
        $this->forge->addForeignKey('booking_id','vehicle_booking','id');

        $this->forge->createTable('vehicle_fuel');
    }

    public function down()
    {
        $this->forge->dropTable('vehicle_fuel');
    }
}