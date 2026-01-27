<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        // Quizzes table
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id('quiz_id');
            $table->foreignId('teacher_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Questions table
        Schema::create('questions', function (Blueprint $table) {
            $table->id('question_id');
            $table->foreignId('quiz_id')->constrained('quizzes', 'quiz_id')->onDelete('cascade');
            $table->text('question_text')->nullable();
            $table->string('question_image')->nullable();
            $table->timestamps();
        });

        // Options table
        Schema::create('options', function (Blueprint $table) {
            $table->id('option_id');
            $table->foreignId('question_id')->constrained('questions', 'question_id')->onDelete('cascade');
            $table->string('option_text');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });

        // Pivot table: quiz assigned to students
        Schema::create('quiz_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes', 'quiz_id')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->timestamps();
        });

        // Quiz submissions table 
        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes', 'quiz_id')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->integer('score')->nullable();
            $table->timestamps(); 
        });

        // Quiz answers table 
        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('quiz_submissions')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions', 'question_id')->onDelete('cascade');
            $table->foreignId('option_id')->nullable()->constrained('options', 'option_id')->onDelete('set null');
            $table->text('text_answer')->nullable(); // ✅ Added for identification questions
            $table->timestamps();
        });

        // ------------------------
        // Shared Quiz Sessions
        // ------------------------

        // Shared quiz sessions table
        Schema::create('shared_quiz_sessions', function (Blueprint $table) {
            $table->id('session_id');
            $table->foreignId('quiz_id')->constrained('quizzes', 'quiz_id')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->string('code')->unique();
            $table->boolean('active')->default(false);      
            $table->integer('duration_minutes')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamps();
        });

        // Shared quiz participants table
        Schema::create('shared_quiz_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('shared_quiz_sessions', 'session_id')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->integer('score')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });

        // ✅ Shared quiz answers table (for quiz review)
        Schema::create('shared_quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained('shared_quiz_participants')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions', 'question_id')->onDelete('cascade');
            $table->foreignId('option_id')->nullable()->constrained('options', 'option_id')->onDelete('set null');
            $table->text('text_answer')->nullable(); // For identification questions
            $table->timestamps();
            
            // Ensure one answer per question per participant
            $table->unique(['participant_id', 'question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shared_quiz_answers'); 
        Schema::dropIfExists('shared_quiz_participants');
        Schema::dropIfExists('shared_quiz_sessions');
        Schema::dropIfExists('quiz_answers');
        Schema::dropIfExists('quiz_submissions');
        Schema::dropIfExists('quiz_student');
        Schema::dropIfExists('options');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('quizzes');
    }
};