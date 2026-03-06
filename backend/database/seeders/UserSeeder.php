<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('slug', 'admin')->first();
        $agentRole = \App\Models\Role::where('slug', 'agent')->first();
        $userRole = \App\Models\Role::where('slug', 'user')->first();

        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        \App\Models\User::create([
            'name' => 'Agent User',
            'email' => 'agent@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => $agentRole->id,
        ]);

        \App\Models\User::create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => $userRole->id,
        ]);
    }
}
