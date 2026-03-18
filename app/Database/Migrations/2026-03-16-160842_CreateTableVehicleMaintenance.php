<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVehicleMaintenance extends Migration
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
            'service_date'=>[
                'type'=>'DATE'
            ],
            'description'=>[
                'type'=>'TEXT'
            ],
            'cost'=>[
                'type'=>'DECIMAL',
                'constraint'=>'12,2'
            ],
            'next_service_date'=>[
                'type'=>'DATE'
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);
        $this->forge->addForeignKey('vehicle_id','vehicle','id');

        $this->forge->createTable('vehicle_maintenance');
    }

    public function down()
    {
        $this->forge->dropTable('vehicle_maintenance');
    }
}