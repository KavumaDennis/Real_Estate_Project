<?php

namespace App\Repositories\Interfaces;

interface PropertyRepositoryInterface extends EloquentRepositoryInterface
{
    public function search(array $filters);
    public function getFeatured();
}
