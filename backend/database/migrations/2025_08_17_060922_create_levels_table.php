<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('game_name', 100);
            $table->integer('unlocked_levels')->unsigned();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');

            // one record per user/game
            $table->unique(['user_id', 'game_name'], 'user_game_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
};
