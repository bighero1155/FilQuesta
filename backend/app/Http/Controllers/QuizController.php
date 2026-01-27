<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Option;
use App\Models\User;
use App\Models\QuizSubmission;
use App\Models\QuizAnswer;
use App\Models\SharedQuizSession;
use App\Models\SharedQuizParticipant;
use App\Models\SharedQuizReaction; 
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Models\SharedQuizAnswer;  

class QuizController extends Controller
{
    private function transformQuestionImages($questions)
    {
        return $questions->transform(function ($question) {
            if ($question->question_image && !str_starts_with($question->question_image, 'http')) {
                $question->question_image = asset('storage/' . $question->question_image);
            }
            return $question;
        });
    }

    private function extractStoragePath($path)
    {
        if (!$path) return null;
        
        if (!str_starts_with($path, 'http')) {
            return $path;
        }
        
        $storagePath = str_replace(url('storage/'), '', $path);
        $storagePath = str_replace(asset('storage/'), '', $storagePath);
        
        return $storagePath;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user && $user->role === 'teacher') {
            $quizzes = Quiz::with('questions.options', 'teacher')
                ->where('teacher_id', $user->user_id)
                ->get();
        } else {
            $quizzes = Quiz::with('questions.options', 'teacher')->get();
        }
        
        $quizzes->each(function ($quiz) {
            $this->transformQuestionImages($quiz->questions);
        });
        
        return $quizzes;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id' => 'required|exists:users,user_id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'questions' => 'array',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'questions.*.options' => 'array',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'boolean',
        ]);

        $quiz = Quiz::create([
            'teacher_id' => $data['teacher_id'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
        ]);

        if (!empty($data['questions'])) {
            foreach ($data['questions'] as $index => $qData) {
                $imagePath = null;

                if ($request->hasFile("questions.{$index}.question_image")) {
                    $image = $request->file("questions.{$index}.question_image");
                    $imagePath = $image->store('quiz_images', 'public');
                }

                $question = $quiz->questions()->create([
                    'question_text' => $qData['question_text'],
                    'question_image' => $imagePath,
                ]);

                if (!empty($qData['options'])) {
                    foreach ($qData['options'] as $oData) {
                        $question->options()->create($oData);
                    }
                }
            }
        }

        $quiz->load('questions.options', 'teacher');
        $this->transformQuestionImages($quiz->questions);
        
        return response()->json($quiz, 201);
    }

    public function show(Quiz $quiz)
    {
        $quiz->load('questions.options', 'teacher');
        $this->transformQuestionImages($quiz->questions);
        return $quiz;
    }

    public function update(Request $request, Quiz $quiz)
    {
        if ($quiz->teacher_id !== $request->user()->user_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only update your own quizzes.'
            ], 403);
        }

        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'questions' => 'array',
            'questions.*.question_text' => 'required|string',
            'questions.*.question_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'questions.*.existing_image' => 'nullable|string',
            'questions.*.options' => 'array',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'boolean',
        ]);

        $quiz->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
        ]);

        foreach ($quiz->questions as $oldQuestion) {
            if ($oldQuestion->question_image) {
                $imagePath = $this->extractStoragePath($oldQuestion->question_image);
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        $quiz->questions()->delete();

        if (!empty($data['questions'])) {
            foreach ($data['questions'] as $index => $qData) {
                $imagePath = null;

                if ($request->hasFile("questions.{$index}.question_image")) {
                    $image = $request->file("questions.{$index}.question_image");
                    $imagePath = $image->store('quiz_images', 'public');
                } elseif (!empty($qData['existing_image'])) {
                    $imagePath = $this->extractStoragePath($qData['existing_image']);
                }

                $question = $quiz->questions()->create([
                    'question_text' => $qData['question_text'],
                    'question_image' => $imagePath,
                ]);

                if (!empty($qData['options'])) {
                    foreach ($qData['options'] as $oData) {
                        $question->options()->create($oData);
                    }
                }
            }
        }

        $quiz->load('questions.options', 'teacher');
        $this->transformQuestionImages($quiz->questions);
        
        return response()->json($quiz);
    }

    public function destroy(Quiz $quiz, Request $request)
    {
        if ($quiz->teacher_id !== $request->user()->user_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own quizzes.'
            ], 403);
        }

        foreach ($quiz->questions as $question) {
            if ($question->question_image) {
                $imagePath = $this->extractStoragePath($question->question_image);
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        $quiz->delete();
        return response()->json(null, 204);
    }

    public function assign(Request $request, Quiz $quiz)
    {
        if ($quiz->teacher_id !== $request->user()->user_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only assign your own quizzes.'
            ], 403);
        }

        $data = $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,user_id'
        ]);

        $quiz->students()->syncWithoutDetaching($data['student_ids']);
        return response()->json(['message' => 'Quiz assigned successfully']);
    }

    public function studentQuizzes($id)
    {
        $student = User::findOrFail($id);

        $quizzes = $student->quizzes()
            ->with('questions.options')
            ->get()
            ->map(function ($quiz) use ($id) {
                $hasSubmission = QuizSubmission::where('quiz_id', $quiz->quiz_id)
                    ->where('student_id', $id)
                    ->exists();

                $this->transformQuestionImages($quiz->questions);

                return [
                    'quiz_id'     => $quiz->quiz_id,
                    'title'       => $quiz->title,
                    'description' => $quiz->description,
                    'completed'   => $hasSubmission,
                    'questions'   => $quiz->questions,
                ];
            });

        return response()->json($quizzes);
    }

    public function submit(Request $request, Quiz $quiz)
    {
        $data = $request->validate([
            'student_id' => 'required|exists:users,user_id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,question_id',
            'answers.*.option_id' => 'nullable|exists:options,option_id',
            'answers.*.text_answer' => 'nullable|string',
        ]);

        try {
            return DB::transaction(function () use ($quiz, $data) {
                $submission = QuizSubmission::create([
                    'quiz_id' => $quiz->quiz_id,
                    'student_id' => $data['student_id'],
                    'score' => 0,
                ]);

                $submissionId = $submission->id;
                $score = 0;

                $quizQuestionIds = $quiz->questions()->pluck('question_id')->toArray();
                $total = count($quizQuestionIds);
                $correct = [];
                $wrong = [];

                foreach ($data['answers'] as $ans) {
                    $questionId = $ans['question_id'];
                    $optionId = $ans['option_id'] ?? null;
                    $textAnswer = $ans['text_answer'] ?? null;

                    if (!in_array($questionId, $quizQuestionIds, true)) {
                        throw new \Exception("Question {$questionId} does not belong to quiz {$quiz->quiz_id}");
                    }

                    $question = Question::with('options')->find($questionId);
                    $isIdentification = $question->options->count() === 1;

                    if ($optionId !== null) {
                        $optionBelongs = Option::where('option_id', $optionId)
                            ->where('question_id', $questionId)
                            ->exists();
                        if (!$optionBelongs) {
                            throw new \Exception("Option {$optionId} is not valid for question {$questionId}");
                        }
                    }

                    QuizAnswer::create([
                        'submission_id' => $submissionId,
                        'question_id' => $questionId,
                        'option_id' => $optionId,
                    ]);

                    $isCorrect = false;

                    if ($isIdentification && $textAnswer !== null) {
                        $correctAnswer = $question->options->first()->option_text;
                        $isCorrect = strcasecmp(trim($textAnswer), trim($correctAnswer)) === 0;
                    } elseif ($optionId !== null) {
                        $isCorrect = (bool) Option::where('option_id', $optionId)->value('is_correct');
                    }

                    if ($isCorrect) {
                        $score++;
                        $correct[] = $questionId;
                    } else {
                        $wrong[] = $questionId;
                    }
                }

                $submission->update(['score' => $score]);

                return response()->json([
                    'submission_id' => $submissionId,
                    'score' => $score,
                    'total' => $total,
                    'correct_answers' => $correct,
                    'wrong_answers' => $wrong,
                ]);
            });
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function results(Quiz $quiz)
    {
        $total = $quiz->questions()->count();

        $submissions = QuizSubmission::where('quiz_id', $quiz->quiz_id)
            ->with('student')
            ->orderByDesc('id')
            ->get()
            ->map(function ($s) use ($total) {
                return [
                    'submission_id' => $s->id,
                    'student_id' => $s->student_id,
                    'first_name' => optional($s->student)->first_name,
                    'score' => (int) $s->score,
                    'total' => (int) $total,
                    'submitted_at' => optional($s->created_at)->toDateTimeString(),
                ];
            });

        return response()->json($submissions);
    }

    public function allResults()
    {
        $results = QuizSubmission::with(['student', 'quiz'])
            ->orderByDesc('id')
            ->get()
            ->map(function ($s) {
                $student = $s->student;
                $quiz = $s->quiz;

                return [
                    'submission_id' => $s->id,
                    'student_id' => $s->student_id,
                    'student_name' => $student?->first_name
                        ?: $student?->username
                        ?: 'Unknown',
                    'quiz_id' => $s->quiz_id,
                    'quiz_title' => $quiz?->title ?? 'Untitled Quiz',
                    'score' => (int) $s->score,
                    'total' => $quiz ? $quiz->questions()->count() : 0,
                    'submitted_at' => optional($s->created_at)->toDateTimeString(),
                ];
            });

        return response()->json($results);
    }

    public function createSharedSession(Request $request, Quiz $quiz)
    {
        $data = $request->validate([
            'teacher_id' => 'required|exists:users,user_id',
            'duration_minutes' => 'nullable|integer|min:1',
        ]);

        $code = strtoupper(Str::random(6));

        $session = SharedQuizSession::create([
            'quiz_id' => $quiz->quiz_id,
            'teacher_id' => $data['teacher_id'],
            'code' => $code,
            'active' => false,
            'duration_minutes' => $data['duration_minutes'] ?? 30,
        ]);

        return response()->json($session, 201);
    }

    public function joinSharedSession(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
            'student_id' => 'required|exists:users,user_id',
        ]);

        $session = SharedQuizSession::where('code', $data['code'])->firstOrFail();

        $participant = SharedQuizParticipant::firstOrCreate(
            ['session_id' => $session->session_id, 'student_id' => $data['student_id']],
            ['score' => 0]
        );

        return response()->json([
            'session' => $session,
            'participant' => $participant,
        ]);
    }

    public function startSharedSession(SharedQuizSession $session)
    {
        $session->update([
            'started_at' => now(),
            'active' => true
        ]);
        return response()->json(['message' => 'Session started']);
    }

    public function getSharedSession($code)
    {
        try {
            $session = SharedQuizSession::where('code', $code)
                ->with([
                    'quiz.questions.options', 
                    'participants.student'
                ]) 
                ->firstOrFail();

            $session->participants->transform(function ($p) {
                $student = $p->student;
                $p->student_name = $student?->first_name
                    ?: $student?->username
                    ?: 'Unknown';
                $p->avatar = $student?->avatar;
                return $p;
            });

            if ($session->quiz && $session->quiz->questions) {
                $this->transformQuestionImages($session->quiz->questions);
            }

            $reactions = SharedQuizReaction::where('session_id', $session->session_id)
                ->where('created_at', '>=', now()->subSeconds(5))
                ->orderBy('created_at', 'desc')
                ->get();

            SharedQuizReaction::where('session_id', $session->session_id)
                ->where('created_at', '<', now()->subSeconds(5))
                ->delete();

            return response()->json([
                'session' => $session,
                'reactions' => $reactions
            ]);

        } catch (\Exception $e) {
            Log::error('Error in getSharedSession: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'error' => 'Failed to load session',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function storeReaction(Request $request, $code)
    {
        $request->validate([
            'emoji' => 'required|string|max:10'
        ]);

        $session = SharedQuizSession::where('code', $code)->firstOrFail();

        SharedQuizReaction::create([
            'session_id' => $session->session_id,
            'emoji' => $request->emoji
        ]);

        SharedQuizReaction::where('session_id', $session->session_id)
            ->where('created_at', '<', now()->subSeconds(5))
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reaction sent successfully'
        ]);
    }

    public function sharedSessionResults(SharedQuizSession $session)
    {
        $results = $session->participants()
            ->with('student')
            ->get()
            ->map(function ($p) {
                return [
                    'student_id'   => $p->student_id,
                    'student_name' => $p->student?->first_name
                        ?: $p->student?->username
                        ?: 'Unknown',
                    'score'        => $p->score,
                    'finished_at'  => optional($p->finished_at)->toDateTimeString(),
                ];
            });

        return response()->json($results);
    }

    public function submitSharedSession(Request $request, SharedQuizSession $session)
    {
        $data = $request->validate([
            'student_id' => 'required|exists:users,user_id',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,question_id',
            'answers.*.option_id' => 'nullable|exists:options,option_id',
            'answers.*.text_answer' => 'nullable|string',
        ]);

        $quiz = $session->quiz;
        $quizQuestionIds = $quiz->questions()->pluck('question_id')->toArray();
        $score = 0;
        $correct = [];
        $wrong = [];

        $participant = SharedQuizParticipant::where('session_id', $session->session_id)
            ->where('student_id', $data['student_id'])
            ->firstOrFail();

        foreach ($data['answers'] as $ans) {
            $questionId = $ans['question_id'];
            $optionId = $ans['option_id'] ?? null;
            $textAnswer = $ans['text_answer'] ?? null;

            if (!in_array($questionId, $quizQuestionIds, true)) {
                continue;
            }

            $question = Question::with('options')->find($questionId);
            $isIdentification = $question->options->count() === 1;

            SharedQuizAnswer::create([
                'participant_id' => $participant->id,
                'question_id' => $questionId,
                'option_id' => $optionId,
                'text_answer' => $textAnswer,
            ]);

            $isCorrect = false;

            if ($isIdentification && $textAnswer !== null) {
                $correctAnswer = $question->options->first()->option_text;
                $isCorrect = strcasecmp(trim($textAnswer), trim($correctAnswer)) === 0;
            } elseif ($optionId !== null) {
                $isCorrect = (bool) Option::where('option_id', $optionId)->value('is_correct');
            }

            if ($isCorrect) {
                $score++;
                $correct[] = $questionId;
            } else {
                $wrong[] = $questionId;
            }
        }

        $answeredIds = array_column($data['answers'], 'question_id');
        $unanswered = array_diff($quizQuestionIds, $answeredIds);
        foreach ($unanswered as $unansweredId) {
            $wrong[] = $unansweredId;
        }

        $participant->update([
            'score' => $score,
            'finished_at' => now(),
        ]);

        return response()->json([
            'participant_id' => $participant->id,
            'score' => $score,
            'total' => count($quizQuestionIds),
            'correct_answers' => $correct,
            'wrong_answers' => $wrong,
        ]);
    }

    public function stopSharedSession(SharedQuizSession $session)
    {
        $session->update(['active' => false]);
        return response()->json(['message' => 'Session stopped']);
    }

    public function listSharedSessions(Request $request)
    {
        $query = SharedQuizSession::with('quiz', 'teacher');

        if ($request->user()->role === 'teacher') {
            $sessions = $query
                ->where('teacher_id', $request->user()->user_id)
                ->get();
        } else {
            $sessions = $query->where('active', true)->get();
        }

        return response()->json($sessions);
    }

    public function allSharedQuizResults()
    {
        $results = SharedQuizParticipant::with(['student', 'session.quiz'])
            ->whereNotNull('finished_at')
            ->orderByDesc('finished_at')
            ->get()
            ->map(function ($participant) {
                $student = $participant->student;
                $session = $participant->session;
                $quiz = $session?->quiz;
                $totalQuestions = $quiz ? $quiz->questions()->count() : 0;

                return [
                    'participant_id' => $participant->id,
                    'student_id' => $participant->student_id,
                    'student_name' => $student?->first_name
                        ?: $student?->username
                        ?: 'Unknown',
                    'quiz_title' => $quiz?->title ?? 'Untitled Quiz',
                    'score' => (int) $participant->score,
                    'total' => $totalQuestions,
                    'finished_at' => optional($participant->finished_at)->toDateTimeString(),
                ];
            });

        return response()->json($results);
    }

    public function deleteSharedSession(SharedQuizSession $session, Request $request)
    {
        if ($session->teacher_id !== $request->user()->user_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own quiz sessions.'
            ], 403);
        }

        $session->participants()->delete();
        SharedQuizReaction::where('session_id', $session->session_id)->delete();
        $session->delete();

        return response()->json([
            'message' => 'Quiz session deleted successfully'
        ], 200);
    }

    public function getSharedQuizReview(SharedQuizSession $session, $studentId)
    {
        $participant = SharedQuizParticipant::where('session_id', $session->session_id)
            ->where('student_id', $studentId)
            ->firstOrFail();

        $quiz = $session->quiz;
        $questions = $quiz->questions()->with('options')->get();

        $this->transformQuestionImages($questions);

        $answers = SharedQuizAnswer::where('participant_id', $participant->id)
            ->get()
            ->keyBy('question_id');

        $reviewData = $questions->map(function ($question) use ($answers) {
            $studentAnswer = $answers->get($question->question_id);
            $correctOption = $question->options->firstWhere('is_correct', true);
            $isIdentification = $question->options->count() === 1;

            $isCorrect = false;
            $studentAnswerValue = null;

            if ($studentAnswer) {
                if ($isIdentification) {
                    $studentAnswerValue = $studentAnswer->text_answer;
                    $isCorrect = strcasecmp(
                        trim($studentAnswer->text_answer ?? ''), 
                        trim($correctOption?->option_text ?? '')
                    ) === 0;
                } else {
                    $studentAnswerValue = $studentAnswer->option_id;
                    $isCorrect = $studentAnswer->option_id === $correctOption?->option_id;
                }
            }

            return [
                'question_id' => $question->question_id,
                'question_text' => $question->question_text,
                'question_image' => $question->question_image,
                'is_identification' => $isIdentification,
                'options' => $question->options->map(function ($option) {
                    return [
                        'option_id' => $option->option_id,
                        'option_text' => $option->option_text,
                        'is_correct' => $option->is_correct,
                    ];
                }),
                'student_answer' => $studentAnswerValue,
                'correct_answer' => $isIdentification 
                    ? $correctOption?->option_text 
                    : $correctOption?->option_id,
                'is_correct' => $isCorrect,
            ];
        });

        return response()->json([
            'participant' => [
                'student_id' => $participant->student_id,
                'score' => $participant->score,
                'finished_at' => $participant->finished_at,
            ],
            'quiz_title' => $quiz->title,
            'total_questions' => $questions->count(),
            'questions' => $reviewData,
        ]);
    }

    public function getQuizReview(QuizSubmission $submission)
    {
        $quiz = $submission->quiz;
        $questions = $quiz->questions()->with('options')->get();
        
        $this->transformQuestionImages($questions);
        
        $answers = QuizAnswer::where('submission_id', $submission->id)
            ->get()
            ->keyBy('question_id');

        $reviewData = $questions->map(function ($question) use ($answers) {
            $studentAnswer = $answers->get($question->question_id);
            $correctOption = $question->options->firstWhere('is_correct', true);
            $isIdentification = $question->options->count() === 1;

            $isCorrect = false;
            $studentAnswerValue = null;

            if ($studentAnswer) {
                if ($isIdentification) {
                    $studentAnswerValue = $studentAnswer->text_answer;
                    $isCorrect = strcasecmp(
                        trim($studentAnswer->text_answer ?? ''), 
                        trim($correctOption?->option_text ?? '')
                    ) === 0;
                } else {
                    $studentAnswerValue = $studentAnswer->option_id;
                    $isCorrect = $studentAnswer->option_id === $correctOption?->option_id;
                }
            }

            return [
                'question_id' => $question->question_id,
                'question_text' => $question->question_text,
                'question_image' => $question->question_image,
                'is_identification' => $isIdentification,
                'options' => $question->options->map(function ($option) {
                    return [
                        'option_id' => $option->option_id,
                        'option_text' => $option->option_text,
                        'is_correct' => $option->is_correct,
                    ];
                }),
                'student_answer' => $studentAnswerValue,
                'correct_answer' => $isIdentification 
                    ? $correctOption?->option_text 
                    : $correctOption?->option_id,
                'is_correct' => $isCorrect,
            ];
        });

        return response()->json([
            'submission' => [
                'submission_id' => $submission->id,
                'student_id' => $submission->student_id,
                'score' => $submission->score,
                'submitted_at' => $submission->created_at,
            ],
            'quiz_title' => $quiz->title,
            'total_questions' => $questions->count(),
            'questions' => $reviewData,
        ]);
    }

    public function getStudentQuizParticipations($studentId)
    {
        $participations = SharedQuizParticipant::where('student_id', $studentId)
            ->whereNotNull('finished_at')
            ->with('session.quiz')
            ->orderByDesc('finished_at')
            ->get()
            ->map(function ($participant) {
                $session = $participant->session;
                $quiz = $session?->quiz;

                return [
                    'session_id' => $session->session_id,
                    'code' => $session->code,
                    'quiz_title' => $quiz?->title ?? 'Untitled Quiz',
                    'score' => $participant->score,
                    'total_questions' => $quiz ? $quiz->questions()->count() : 0,
                    'finished_at' => $participant->finished_at,
                ];
            });

        return response()->json($participations);
    }
}