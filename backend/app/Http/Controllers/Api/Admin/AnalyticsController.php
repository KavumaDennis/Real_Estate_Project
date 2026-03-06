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
        $user = auth()->user();
        $isAdmin = $user->role?->slug === 'admin';

        $totalViewsQuery = Property::query();
        $leadsCountQuery = Inquiry::query();
        $activeListingsQuery = Property::where('is_published', true);
        $viewsTrendQuery = PropertyView::where('created_at', '>=', Carbon::now()->subDays(6));

        if (!$isAdmin) {
            $totalViewsQuery->where('agent_id', $user->id);
            $leadsCountQuery->where('agent_id', $user->id);
            $activeListingsQuery->where('agent_id', $user->id);
            $viewsTrendQuery->whereHas('property', function($q) use ($user) {
                $q->where('agent_id', $user->id);
            });
        }

        $totalViews = $totalViewsQuery->sum('views_count');
        $leadsCount = $leadsCountQuery->count();
        $activeListings = $activeListingsQuery->count();

        // Calculate changes (Current vs Previous week)
        $lastWeekViews = PropertyView::where('created_at', '>=', Carbon::now()->subDays(14))
            ->where('created_at', '<', Carbon::now()->subDays(7));
        
        $lastWeekLeads = Inquiry::where('created_at', '>=', Carbon::now()->subDays(14))
            ->where('created_at', '<', Carbon::now()->subDays(7));

        if (!$isAdmin) {
            $lastWeekViews->whereHas('property', fn($q) => $q->where('agent_id', $user->id));
            $lastWeekLeads->where('agent_id', $user->id);
        }

        $prevViews = $lastWeekViews->count();
        $prevLeads = $lastWeekLeads->count();

        // Weekly Traffic (Last 7 Days)
        $weeklyTraffic = $viewsTrendQuery
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as views'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('views', 'date');

        $viewsChange = $prevViews > 0 ? (($weeklyTraffic->sum() - $prevViews) / $prevViews) * 100 : 0;
        $leadsChange = $prevLeads > 0 ? (($leadsCount - $prevLeads) / $prevLeads) * 100 : 0;
        $clickRate = $totalViews > 0 ? ($leadsCount / $totalViews) * 100 : 0;

        $chartData = [];
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $days[] = Carbon::now()->subDays($i)->format('D');
            $chartData[] = $weeklyTraffic[$date] ?? 0;
        }

        // Top Performer
        $topPerformerQuery = Property::with(['location', 'images']);
        if (!$isAdmin) {
            $topPerformerQuery->where('agent_id', $user->id);
        }
        $topPerformer = $topPerformerQuery->orderBy('views_count', 'desc')->first();

        // Recent Activity
        $recentInquiriesQuery = Inquiry::with('property');
        if (!$isAdmin) {
            $recentInquiriesQuery->where('agent_id', $user->id);
        }
        $recentInquiries = $recentInquiriesQuery->latest()->limit(5)->get();

        return response()->json([
            'stats' => [
                ['name' => 'Total Views', 'value' => number_format($totalViews), 'change' => ($viewsChange >= 0 ? '+' : '') . round($viewsChange, 1) . '%', 'icon' => 'HiEye', 'color' => 'bg-blue-100 text-blue-600'],
                ['name' => 'Leads Generated', 'value' => (string)$leadsCount, 'change' => ($leadsChange >= 0 ? '+' : '') . round($leadsChange, 1) . '%', 'icon' => 'HiUsers', 'color' => 'bg-purple-100 text-purple-600'],
                ['name' => 'Click Rate', 'value' => round($clickRate, 1) . '%', 'change' => '0%', 'icon' => 'HiCursorClick', 'color' => 'bg-green-100 text-green-600'],
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
                'image' => $topPerformer->images->first() ? $topPerformer->images->first()->image_path : null,
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
