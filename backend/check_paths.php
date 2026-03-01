<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\PropertyImage;
use App\Models\Post;

$output = "";
$output .= "--- USERS AVATARS ---\n";
User::whereNotNull('avatar')->limit(3)->get()->each(function($u) use (&$output) {
    $output .= "ID: {$u->id}, Name: {$u->name}, Raw Avatar: [{$u->avatar}], URL: [{$u->avatar_url}]\n";
});

$output .= "\n--- PROPERTY IMAGES ---\n";
PropertyImage::limit(5)->get()->each(function($pi) use (&$output) {
    $output .= "ID: {$pi->id}, Raw Path: [{$pi->image_path}], URL: [{$pi->url}]\n";
});

$output .= "\n--- POSTS ---\n";
Post::limit(3)->get()->each(function($p) use (&$output) {
    $output .= "ID: {$p->id}, Raw Image: [{$p->featured_image}], URL: [{$p->featured_image_url}]\n";
});

file_put_contents('path_audit.txt', $output);
echo "Audit complete. See path_audit.txt\n";
