<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateApproveBooking extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'auto_increment' => true
            ],
            'booking_id' => [
                'type' => 'INT'
            ],
            'approver_id' => [
                'type' => 'INT'
            ],
            'level' => [
                'type' => 'INT'
            ],
            'approve_date' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'approval_status' => [
                'type' => 'ENUM',
                'constraint' => ['accepted', 'pending', 'rejected'],
                'default' => 'pending'
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
            'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        $this->forge->addKey('id', true);

        $this->forge->addForeignKey('booking_id', 'vehicle_booking', 'id');
        $this->forge->addForeignKey('approver_id', 'user', 'id');

        $this->forge->createTable('approve_booking');
    }

    public function down()
    {
        $this->forge->dropTable('approve_booking');
    }
}
