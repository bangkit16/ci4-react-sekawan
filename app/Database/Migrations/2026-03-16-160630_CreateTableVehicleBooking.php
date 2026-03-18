<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVehicleBooking extends Migration
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
            'driver_id'=>[
                'type'=>'INT'
            ],
            'requested_by_id'=>[
                'type'=>'INT'
            ],
            'start_date'=>[
                'type'=>'DATETIME'
            ],
            'end_date'=>[
                'type'=>'DATETIME'
            ],
            'booking_status'=>[
                'type'=>'ENUM',
                'constraint'=>['approved','pending','rejected']
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
            'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);

        $this->forge->addForeignKey('vehicle_id','vehicle','id');
        $this->forge->addForeignKey('driver_id','driver','id');
        $this->forge->addForeignKey('requested_by_id','employee','id');

        $this->forge->createTable('vehicle_booking');
    }

    public function down()
    {
        $this->forge->dropTable('vehicle_booking');
    }
}
