<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTableVehicle extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'=>[
                'type'=>'INT',
                'auto_increment'=>true
            ],
            'vehicle_brand'=>[
                'type'=>'VARCHAR',
                'constraint'=>100
            ],
            'vehicle_ownership'=>[
                'type'=>'ENUM',
                'constraint'=>['rent','owned']
            ],
            'vehicle_number_plate'=>[
                'type'=>'VARCHAR',
                'constraint'=>20
            ],
            'vehicle_year'=>[
                'type'=>'YEAR'
            ],
            'vehicle_type'=>[
                'type'=>'ENUM',
                'constraint'=>['goods','humans']
            ],
            'vehicle_status'=>[
                'type'=>'ENUM',
                'constraint'=>['available','booked','maintenance']
            ],
            'vehicle_location'=>[
                'type'=>'INT'
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
            'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);
        $this->forge->addForeignKey('vehicle_location','location','id','CASCADE','CASCADE');
        $this->forge->createTable('vehicle');
    }

    public function down()
    {
        $this->forge->dropTable('vehicle');
    }
}
