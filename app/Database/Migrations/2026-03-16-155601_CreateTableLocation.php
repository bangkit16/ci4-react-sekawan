<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTableLocation extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'auto_increment' => true
            ],
            'region_id' => [
                'type' => 'INT'
            ],
            'location_name' => [
                'type' => 'VARCHAR',
                'constraint' => 100
            ],
            'address' => [
                'type' => 'TEXT'
            ],
            'type' => [
                'type' => 'ENUM',
                'constraint' => ['hq', 'branch', 'mine']
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
            'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('region_id', 'region', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('location');
    }

    public function down()
    {
        $this->forge->dropTable('location');
    }
}
