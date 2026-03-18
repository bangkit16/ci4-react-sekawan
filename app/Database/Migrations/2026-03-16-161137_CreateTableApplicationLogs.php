<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateApplicationLogs extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'=>[
                'type'=>'INT',
                'auto_increment'=>true
            ],
            'user_id'=>[
                'type'=>'INT'
            ],
            'action'=>[
                'type'=>'VARCHAR',
                'constraint'=>255
            ],
            'description'=>[
                'type'=>'TEXT'
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);
        $this->forge->addForeignKey('user_id','user','id');

        $this->forge->createTable('application_logs');
    }

    public function down()
    {
        $this->forge->dropTable('application_logs');
    }
}
