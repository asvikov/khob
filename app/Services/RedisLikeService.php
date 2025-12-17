<?php

namespace App\Services;

use App\Contracts\LikeServiceInterface;
use App\Models\Like;
use Illuminate\Support\Facades\Redis;
use App\Jobs\InsertDBLikeJob;

class RedisLikeService implements LikeServiceInterface
{
    protected $redis;

    public function __construct()
    {
        $this->redis = Redis::connection('likes');
    }

    public function like(string $likeableType, int $likeableId, int $userId): void
    {
        $this->handleReaction($likeableType, $likeableId, $userId, Like::TYPE_LIKE);
    }

    public function dislike(string $likeableType, int $likeableId, int $userId): void
    {
        $this->handleReaction($likeableType, $likeableId, $userId, Like::TYPE_DISLIKE);
    }

    protected function handleReaction(string $likeableType, int $likeableId, int $userId, int $newReactionType): void
    {
        $userReactionKey = "user_like:{$userId}:{$likeableType}:{$likeableId}";
        $likesCountKey = "likes:{$likeableType}:{$likeableId}";
        $dislikesCountKey = "dislikes:{$likeableType}:{$likeableId}";
        $currentReaction = $this->redis->get($userReactionKey);

        if ($currentReaction == $newReactionType) {
            $this->removeReaction($likeableType, $likeableId, $userId);
            return;
        }

        $this->redis->pipeline(function ($pipe) use ($userReactionKey, $likesCountKey, $dislikesCountKey, $currentReaction, $newReactionType) {

            if ($currentReaction == Like::TYPE_LIKE) {
                $pipe->decr($likesCountKey);
            } elseif ($currentReaction == Like::TYPE_DISLIKE) {
                $pipe->decr($dislikesCountKey);
            }

            if ($newReactionType == Like::TYPE_LIKE) {
                $pipe->incr($likesCountKey);
            } elseif ($newReactionType == Like::TYPE_DISLIKE) {
                $pipe->incr($dislikesCountKey);
            }

            $pipe->set($userReactionKey, $newReactionType);
        });

        InsertDBLikeJob::dispatch($likeableType, $likeableId, $userId, $newReactionType);
    }

    public function removeReaction(string $likeableType, int $likeableId, int $userId): void
    {
        $userReactionKey = "user_like:{$userId}:{$likeableType}:{$likeableId}";
        $likesCountKey = "likes:{$likeableType}:{$likeableId}";
        $dislikesCountKey = "dislikes:{$likeableType}:{$likeableId}";

        $currentReaction = $this->redis->get($userReactionKey);

        $this->redis->pipeline(function ($pipe) use ($userReactionKey, $likesCountKey, $dislikesCountKey, $currentReaction) {

            if ($currentReaction == Like::TYPE_LIKE) {
                $pipe->decr($likesCountKey);
            } elseif ($currentReaction == Like::TYPE_DISLIKE) {
                $pipe->decr($dislikesCountKey);
            }

            $pipe->del($userReactionKey);
        });

        InsertDBLikeJob::dispatch($likeableType, $likeableId, $userId, null);
        return;
    }

    public function getLikesCount(string $likeableType, int $likeableId): int
    {
        return (int) $this->redis->get("likes:{$likeableType}:{$likeableId}") ?: 0;
    }

    public function getDislikesCount(string $likeableType, int $likeableId): int
    {
        return (int) $this->redis->get("dislikes:{$likeableType}:{$likeableId}") ?: 0;
    }

    public function getUserReaction(string $likeableType, int $likeableId, int $userId): ?int
    {
        return (int) $this->redis->get("user_like:{$userId}:{$likeableType}:{$likeableId}") ?: null;
    }
}
