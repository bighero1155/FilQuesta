<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cosmetics', function (Blueprint $table) {
            $table->id('cosmetic_id');
            $table->enum('type', ['avatar', 'badge', 'nick_frame']); // Cosmetic category
            $table->string('name', 100);
            $table->string('description', 255)->nullable();
            $table->integer('price')->default(0);
            $table->string('image')->nullable(); // Image path or filename
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cosmetics');
    }
};
