<?php

namespace App\Contracts;

interface LikeServiceInterface {

    public function like(string $likeableType, int $likeableId, int $userId): void;
    public function dislike(string $likeableType, int $likeableId, int $userId): void;
    public function removeReaction(string $likeableType, int $likeableId, int $userId): void;
    public function getLikesCount(string $likeableType, int $likeableId): int;
    public function getDislikesCount(string $likeableType, int $likeableId): int;
    public function getUserReaction(string $likeableType, int $likeableId, int $userId): ?int;
}