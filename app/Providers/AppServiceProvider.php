<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\LikeServiceInterface;
use App\Services\RedisLikeService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(LikeServiceInterface::class, RedisLikeService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
