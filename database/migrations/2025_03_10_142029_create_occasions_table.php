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
        Schema::create('occasions', function (Blueprint $table) {
            $table->id();
            $table->timestamp('start')->nullable();
            $table->timestamp('end')->nullable();
            $table->text('description');
            $table->string('address', 512)->nullable();
            $table->geography('location', subtype: 'point', srid: 4326)->spatialIndex()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('occasions');
    }
};
