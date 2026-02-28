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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('type', ['house', 'apartment', 'commercial', 'land']);
            $table->enum('status', ['for_sale', 'for_rent']);
            $table->decimal('price', 15, 2);
            $table->string('address');
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->foreignId('agent_id')->constrained('users')->onDelete('cascade');
            
            // General features
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->decimal('size', 10, 2)->nullable(); // House/Building size
            
            // Land specific features
            $table->decimal('land_size', 10, 2)->nullable(); // Plot size
            $table->string('land_size_unit')->default('sqm'); // sqm, acres
            $table->string('zoning')->nullable();
            $table->string('topography')->nullable();
            $table->string('access_road')->nullable();
            $table->string('title_type')->nullable(); // deed, certificate, etc.
            $table->decimal('price_per_sqm', 15, 2)->nullable();
            
            // Coordinates
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
