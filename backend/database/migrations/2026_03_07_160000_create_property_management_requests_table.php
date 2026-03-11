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
        Schema::create('property_management_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->nullable()->constrained()->nullOnDelete();

            $table->string('title');
            $table->string('property_type')->nullable();
            $table->string('address');
            $table->string('management_scope');
            $table->text('notes')->nullable();

            $table->string('owner_name');
            $table->string('owner_email');
            $table->string('owner_phone')->nullable();

            $table->string('status')->default('pending'); // pending, under_review, approved, rejected, cancelled
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_management_requests');
    }
};

