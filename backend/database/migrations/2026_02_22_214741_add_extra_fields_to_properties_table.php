<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('virtual_tour_url')->nullable()->after('description');
            $table->enum('availability', ['available', 'sold', 'reserved', 'off_market'])->default('available')->after('status');
            $table->integer('views_count')->default(0)->after('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['virtual_tour_url', 'availability', 'views_count']);
        });
    }
};
