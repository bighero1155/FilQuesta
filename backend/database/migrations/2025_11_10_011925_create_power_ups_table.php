<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('power_ups', function (Blueprint $table) {
            $table->id('power_up_id');
            $table->string('name', 100);
            $table->enum('type', ['time_freeze', 'second_chance', 'score_booster']);
            $table->string('description', 255)->nullable();
            $table->integer('price')->default(0);
            $table->integer('duration_seconds')->nullable(); 
            $table->decimal('multiplier', 4, 2)->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('power_ups');
    }
};
