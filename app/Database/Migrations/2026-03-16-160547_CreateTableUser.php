<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUser extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'=>[
                'type'=>'INT',
                'auto_increment'=>true
            ],
            'name'=>[
                'type'=>'VARCHAR',
                'constraint'=>100
            ],
            'email'=>[
                'type'=>'VARCHAR',
                'constraint'=>100
            ],
            'password'=>[
                'type'=>'VARCHAR',
                'constraint'=>255
            ],
            'role'=>[
                'type'=>'ENUM',
                'constraint'=>['admin','approver']
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
            'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id',true);
        $this->forge->addUniqueKey('email'); 
        $this->forge->createTable('user');
    }

    public function down()
    {
        $this->forge->dropTable('user');
    }
}