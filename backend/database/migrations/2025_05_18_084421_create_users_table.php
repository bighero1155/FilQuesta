<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('first_name', 55)->nullable();
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55)->nullable();
            $table->string('age');
            $table->string('address', 255)->nullable();
            $table->string('school', 255)->nullable();
            $table->string('contact_number', 55)->nullable();
            $table->string('username', 55)->unique();
            $table->string('section', 55)->nullable();
            $table->string('email')->nullable();
            $table->string('password', 255);
            $table->enum('role', ['student', 'teacher', 'admin'])->default('student');

            $table->integer('coins')->default(0); // Total coins earned
            $table->integer('total_score')->default(0); // Cumulative game score
            $table->string('avatar')->nullable(); // Avatar image or path
            $table->string('rank')->default('Beginner'); // Default rank

            $table->timestamp('last_login_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
 