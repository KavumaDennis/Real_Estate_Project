<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            ['name' => 'Kampala', 'type' => 'city'],
            ['name' => 'Entebbe', 'type' => 'city'],
            ['name' => 'Wakiso', 'type' => 'district'],
            ['name' => 'Kira', 'type' => 'municipality'],
            ['name' => 'Mukono', 'type' => 'municipality'],
            ['name' => 'Mbarara', 'type' => 'city'],
            ['name' => 'Jinja', 'type' => 'city'],
        ];

        foreach ($locations as $location) {
            Location::create([
                'name' => $location['name'],
                'slug' => Str::slug($location['name']),
                'type' => $location['type'],
            ]);
        }
    }
}
