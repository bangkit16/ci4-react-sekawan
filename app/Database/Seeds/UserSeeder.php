<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => password_hash('password', PASSWORD_DEFAULT),
                'role' => 'admin'
            ],
            [
                'name' => 'Approver',
                'email' => 'approver@gmail.com',
                'password' => password_hash('password', PASSWORD_DEFAULT),
                'role' => 'approver'
            ]
        ];

        $this->db->table('user')->insertBatch($data);
    }
}