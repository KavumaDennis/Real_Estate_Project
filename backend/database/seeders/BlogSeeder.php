<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Market Trends', 'slug' => 'market-trends', 'description' => 'Latest updates in the real estate market.'],
            ['name' => 'Home Buying Tips', 'slug' => 'home-buying-tips', 'description' => 'Advice for first-time home buyers.'],
            ['name' => 'Interior Design', 'slug' => 'interior-design', 'description' => 'Inspiration for your home\'s interior.'],
        ];

        foreach ($categories as $cat) {
            \App\Models\PostCategory::create($cat);
        }

        $user = \App\Models\User::first();
        if (!$user) {
            $user = \App\Models\User::create([
                'name' => 'Admin User',
                'email' => 'admin@realestate.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]);
        }
        
        $cat = \App\Models\PostCategory::where('slug', 'market-trends')->first();

        \App\Models\Post::create([
            'title' => 'Top 10 Real Estate Trends to Watch in 2026',
            'slug' => 'top-10-real-estate-trends',
            'excerpt' => 'Discover the key trends shaping the property market this year, from sustainable living to AI-driven valuations.',
            'content' => 'The real estate market is evolving faster than ever. In this comprehensive guide, we explore how sustainable building practices are becoming the gold standard, and why AI-driven technology is revolutionizing how we find and value properties. Whether you are a first-time buyer or a seasoned investor, staying ahead of these trends is crucial for success.',
            'featured_image' => 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'category_id' => $cat->id,
            'author_id' => $user->id,
            'status' => 'published'
        ]);

        \App\Models\Post::create([
            'title' => 'The Ultimate Guide to Modern Minimalist Interiors',
            'slug' => 'modern-minimalist-interiors',
            'excerpt' => 'Learn how to transform your home into a serene, minimalist sanctuary without losing comfort.',
            'content' => 'Minimalism is not about having nothing, it\'s about having exactly what you need. In this article, our design experts share their secrets for choosing the right color palettes, lighting, and statement pieces to create a high-end minimalist look that feels warm and welcoming. We cover everything from open-concept living to smart storage solutions.',
            'featured_image' => 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'category_id' => \App\Models\PostCategory::where('slug', 'interior-design')->first()->id,
            'author_id' => $user->id,
            'status' => 'published'
        ]);
    }
}
