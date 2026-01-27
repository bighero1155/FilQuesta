<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shared_quiz_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('shared_quiz_sessions', 'session_id')->onDelete('cascade');
            $table->string('emoji', 10);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shared_quiz_reactions');
    }
};