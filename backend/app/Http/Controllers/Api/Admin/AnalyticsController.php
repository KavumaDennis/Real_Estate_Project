<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Inquiry;
use App\Models\PropertyView;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        $totalViews = Property::sum('views_count');
        $leadsCount = Inquiry::count();
        $activeListings = Property::where('is_published', true)->count();
        
        // Weekly Traffic (Last 7 Days)
        $weeklyTraffic = PropertyView::where('created_at', '>=', Carbon::now()->subDays(6))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as views'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('views', 'date');

        $chartData = [];
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $days[] = Carbon::now()->subDays($i)->format('D');
            $chartData[] = $weeklyTraffic[$date] ?? 0;
        }

        // Top Performer
        $topPerformer = Property::with(['location', 'images'])
            ->orderBy('views_count', 'desc')
            ->first();

        // Recent Activity
        $recentInquiries = Inquiry::with('property')
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                ['name' => 'Total Views', 'value' => number_format($totalViews), 'change' => '+0%', 'icon' => 'HiEye', 'color' => 'bg-blue-100 text-blue-600'],
                ['name' => 'Leads Generated', 'value' => (string)$leadsCount, 'change' => '+0%', 'icon' => 'HiUsers', 'color' => 'bg-purple-100 text-purple-600'],
                ['name' => 'Click Rate', 'value' => '0.0%', 'change' => '0%', 'icon' => 'HiCursorClick', 'color' => 'bg-green-100 text-green-600'],
                ['name' => 'Active Listings', 'value' => (string)$activeListings, 'change' => '0%', 'icon' => 'HiCollection', 'color' => 'bg-orange-100 text-orange-600'],
            ],
            'chart' => [
                'data' => $chartData,
                'days' => $days
            ],
            'topPerformer' => $topPerformer ? [
                'title' => $topPerformer->title,
                'price' => $topPerformer->price,
                'location' => $topPerformer->location ? $topPerformer->location->name : $topPerformer->address,
                'image' => $topPerformer->images->first() ? asset('storage/' . $topPerformer->images->first()->image_path) : null,
                'views' => $topPerformer->views_count
            ] : null,
            'recentActivity' => $recentInquiries->map(function($inquiry) {
                return [
                    'type' => 'inquiry',
                    'title' => 'New Inquiry received',
                    'desc' => "{$inquiry->name} viewed {$inquiry->property->title}",
                    'time' => $inquiry->created_at->diffForHumans()
                ];
            })
        ]);
    }
}
