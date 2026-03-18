<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTableRegion extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'auto_increment' => true
            ],
            'region_name' => [
                'type' => 'VARCHAR',
                'constraint' => 100
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
            'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id', true);
        $this->forge->createTable('region');
    }

    public function down()
    {
        $this->forge->dropTable('region');
    }
}
