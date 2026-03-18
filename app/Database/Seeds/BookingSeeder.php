<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run()
    {
        // Create 3 bookings
        $bookings = [
            [
                'vehicle_id' => 1,
                'driver_id' => 1,
                'requested_by_id' => 1,
                'start_date' => date('Y-m-d H:i:s', strtotime('+1 day')),
                'end_date' => date('Y-m-d H:i:s', strtotime('+2 days')),
                'booking_status' => 'pending',
            ],
            [
                'vehicle_id' => 2,
                'driver_id' => 2,
                'requested_by_id' => 2,
                'start_date' => date('Y-m-d H:i:s', strtotime('+3 days')),
                'end_date' => date('Y-m-d H:i:s', strtotime('+4 days')),
                'booking_status' => 'pending',
            ],
            [
                'vehicle_id' => 3,
                'driver_id' => 3,
                'requested_by_id' => 3,
                'start_date' => date('Y-m-d H:i:s', strtotime('+5 days')),
                'end_date' => date('Y-m-d H:i:s', strtotime('+6 days')),
                'booking_status' => 'pending',
            ],
        ];

        foreach ($bookings as $booking) {
            $this->db->table('vehicle_booking')->insert($booking);
            $bookingId = $this->db->insertID();

            // Create 2 approvals for each booking (level 1 and 2)
            // Level 1: approver_id = 1
            // Level 2: approver_id = 2
            $approvals = [
                [
                    'booking_id' => $bookingId,
                    'approver_id' => 1,
                    'level' => 1,
                    'approval_status' => 'pending',
                ],
                [
                    'booking_id' => $bookingId,
                    'approver_id' => 2,
                    'level' => 2,
                    'approval_status' => 'pending',
                ],
            ];

            $this->db->table('approve_booking')->insertBatch($approvals);
        }
    }
}
