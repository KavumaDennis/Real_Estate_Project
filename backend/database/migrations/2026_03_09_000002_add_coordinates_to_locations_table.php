<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('type');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

        $cityCoordinates = [
            'Kampala' => [0.3475964, 32.5825197],
            'Entebbe' => [0.0562100, 32.4795300],
            'Wakiso' => [0.4044400, 32.4598600],
            'Kira' => [0.3891700, 32.6491700],
            'Mukono' => [0.3533300, 32.7552800],
            'Mbarara' => [-0.6071590, 30.6545020],
            'Jinja' => [0.4478570, 33.2026120],
        ];

        foreach ($cityCoordinates as $name => [$lat, $lng]) {
            DB::table('locations')
                ->where('name', $name)
                ->update([
                    'latitude' => $lat,
                    'longitude' => $lng,
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
