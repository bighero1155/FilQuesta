<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_power_ups', function (Blueprint $table) {
            $table->id('user_power_up_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('power_up_id');
            $table->integer('quantity')->default(0);
            $table->timestamps();

            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');

            $table->foreign('power_up_id')
                ->references('power_up_id')->on('power_ups')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_power_ups');
    }
};
