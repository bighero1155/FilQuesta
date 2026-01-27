<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_cosmetics', function (Blueprint $table) {
            $table->id('user_cosmetic_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('cosmetic_id');
            $table->boolean('is_equipped')->default(false);
            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')
                ->references('user_id')->on('users')
                ->onDelete('cascade');

            $table->foreign('cosmetic_id')
                ->references('cosmetic_id')->on('cosmetics')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_cosmetics');
    }
};
