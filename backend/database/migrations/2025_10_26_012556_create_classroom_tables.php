<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Classrooms table
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id('classroom_id');
            $table->foreignId('teacher_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->string('title');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Classroom students pivot table with points
        Schema::create('classroom_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_id')->constrained('classrooms', 'classroom_id')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->integer('points')->default(0); // Track points per student
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('classroom_students');
        Schema::dropIfExists('classrooms');
    }
};
