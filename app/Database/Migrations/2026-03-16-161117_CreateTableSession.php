<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSession extends Migration
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
            'refresh_token'=>[
                'type'=>'TEXT'
            ],
            'expired_at'=>[
                'type'=>'DATETIME'
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);
        $this->forge->addForeignKey('user_id','user','id');

        $this->forge->createTable('session');
    }

    public function down()
    {
        $this->forge->dropTable('session');
    }
}