<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use App\Models\Inquiry;
use App\Models\Transaction;
use App\Models\ServiceRequirement;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_agents' => User::whereHas('role', fn($q) => $q->where('slug', 'agent'))->count(),
            'total_properties' => Property::count(),
            'total_leads' => Inquiry::count(),
            'total_service_requests' => ServiceRequirement::count(),
            'total_revenue' => Transaction::where('status', 'completed')->sum('amount'),
            'recent_users' => User::with('role')->latest()->limit(5)->get(),
            'recent_properties' => Property::with(['location', 'images'])->latest()->limit(5)->get(),
            'recent_service_requests' => ServiceRequirement::with(['service:id,name', 'user:id,name,email'])->latest()->limit(5)->get(),
            'sales_chart' => $this->getSalesChartData(),
            'recent_activity' => $this->getRecentActivity(),
        ];

        return response()->json($stats);
    }

    private function getSalesChartData()
    {
        $data = [];
        $labels = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $labels[] = $date->format('D');
            $data[] = Transaction::whereDate('created_at', $date)
                ->where('status', 'completed')
                ->sum('amount');
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Revenue',
                    'data' => $data,
                ]
            ]
        ];
    }

    private function getRecentActivity()
    {
        $activities = [];

        $recentInquiries = Inquiry::with('property')->latest()->limit(5)->get();
        foreach ($recentInquiries as $inquiry) {
            $activities[] = [
                'type' => 'inquiry',
                'title' => 'New Inquiry from ' . $inquiry->name,
                'desc' => 'Interest in ' . ($inquiry->property->title ?? 'a property'),
                'time' => $inquiry->created_at->diffForHumans(),
            ];
        }

        $recentProps = Property::latest()->limit(5)->get();
        foreach ($recentProps as $prop) {
            $activities[] = [
                'type' => 'property',
                'title' => 'New Listing: ' . $prop->title,
                'desc' => 'Added to ' . ($prop->location->name ?? 'system'),
                'time' => $prop->created_at->diffForHumans(),
            ];
        }

        usort($activities, function ($a, $b) {
            return 0; // Simple enough for now or sort by timestamp if we had it
        });

        return array_slice($activities, 0, 8);
    }
}
