<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PowerUp;

class PowerUpSeeder extends Seeder
{
    public function run(): void
    {
        $powerUps = [
            [
                'name' => 'Time Freeze',
                'type' => 'time_freeze',
                'description' => 'Pauses the timer for the current question for 10 seconds.',
                'price' => 100,
                'duration_seconds' => 10,
            ],
            [
                'name' => 'Second Chance',
                'type' => 'second_chance',
                'description' => 'Retry one of your failed questions or levels.',
                'price' => 150,
            ],
            [
                'name' => 'Score Booster',
                'type' => 'score_booster',
                'description' => 'Doubles your score when activated.',
                'price' => 200,
                'multiplier' => 2.0,
            ],
        ];

        foreach ($powerUps as $pu) {
            PowerUp::updateOrCreate(['type' => $pu['type']], $pu);
        }
    }
}
