<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTableDriver extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'=>[
                'type'=>'INT',
                'auto_increment'=>true
            ],
            'driver_name'=>[
                'type'=>'VARCHAR',
                'constraint'=>100
            ],
            'driver_phone'=>[
                'type'=>'VARCHAR',
                'constraint'=>20
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
            'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);
        $this->forge->createTable('driver');
    }

    public function down()
    {
        $this->forge->dropTable('driver');
    }
}
