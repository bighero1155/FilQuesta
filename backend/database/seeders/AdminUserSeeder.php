<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'username' => 'adminuser',
            'first_name' => 'Admin',
            'middle_name' => null,
            'last_name' => 'User',
            'age' => '30',
            'address' => 'Admin Office',
            'contact_number' => '09123456789',
            'email' => 'admin@gmail.com',
            'section' => null,
            'password' => Hash::make('password'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
