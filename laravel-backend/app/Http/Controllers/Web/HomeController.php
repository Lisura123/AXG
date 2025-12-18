<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home page
     */
    public function index(): Response
    {
        return Inertia::render('Home', [
            'featuredProducts' => \App\Models\Product::where('is_featured', true)
                ->where('is_active', true)
                ->latest()
                ->limit(6)
                ->get(),
            'categories' => \App\Models\Category::where('is_active', true)->get(),
        ]);
    }

    /**
     * Display the about page
     */
    public function about(): Response
    {
        return Inertia::render('About');
    }

    /**
     * Display the contact page
     */
    public function contact(): Response
    {
        return Inertia::render('Contact');
    }
}
