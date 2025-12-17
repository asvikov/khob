<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Like;

class InsertDBLikeJob implements ShouldQueue
{
    use Queueable;

    public $likeableType;
    public $likeableId;
    public $userId;
    public $type;

    /**
     * Create a new job instance.
     */
    public function __construct(string $likeableType, int $likeableId, int $userId, ?int $type)
    {
        $this->likeableType = $likeableType;
        $this->likeableId = $likeableId;
        $this->userId = $userId;
        $this->type = $type;

        //$this->onQueue('likes');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $like = Like::firstOrNew([
            'user_id' => $this->userId,
            'likeable_id' => $this->likeableId,
            'likeable_type' => $this->likeableType,
        ]);

        if ($this->type === null) {
            
            if ($like->exists) {
                $like->delete();
            }
        } else {
            $like->type = $this->type;
            $like->save();
        }
    }
}
