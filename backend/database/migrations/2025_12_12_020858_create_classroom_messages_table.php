<?php
// database/migrations/xxxx_xx_xx_create_classroom_messages_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('classroom_messages', function (Blueprint $table) {
            $table->id('message_id');
            $table->unsignedBigInteger('classroom_id');
            $table->unsignedBigInteger('user_id');
            $table->text('message');
            $table->timestamps();
            
            $table->foreign('classroom_id')
                  ->references('classroom_id')
                  ->on('classrooms')
                  ->onDelete('cascade');
            
            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->index(['classroom_id', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('classroom_messages');
    }
};