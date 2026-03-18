<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AlterBookingStatusEnum extends Migration
{
    public function up()
    {
        // Alter the booking_status enum to include new statuses
        $this->db->query("ALTER TABLE vehicle_booking MODIFY booking_status ENUM('pending', 'approve:level1', 'approve:level2', 'rejected:level1', 'rejected:level2') DEFAULT 'pending'");
    }

    public function down()
    {
        // Revert to original enum
        $this->db->query("ALTER TABLE vehicle_booking MODIFY booking_status ENUM('approved','pending','rejected') DEFAULT 'pending'");
    }
}
