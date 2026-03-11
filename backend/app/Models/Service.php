<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Service extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'image_path'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return \App\Helpers\StorageUrlHelper::url($this->image_path);
    }

    public function agents()
    {
        return $this->belongsToMany(User::class, 'service_agent', 'service_id', 'user_id')
            ->withTimestamps();
    }

    public function requirements()
    {
        return $this->hasMany(ServiceRequirement::class);
    }
}
