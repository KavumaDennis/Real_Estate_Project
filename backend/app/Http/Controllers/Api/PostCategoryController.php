<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use App\Http\Resources\PostCategoryResource;
use Illuminate\Http\Request;

class PostCategoryController extends Controller
{
    public function index()
    {
        return PostCategoryResource::collection(PostCategory::all());
    }
}
