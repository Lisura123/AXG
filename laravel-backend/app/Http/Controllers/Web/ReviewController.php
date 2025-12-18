<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Store a new review
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string|max:1000',
            'images' => 'nullable|array|max:3',
            'images.*' => 'image|max:2048',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['is_approved'] = false; // Reviews need approval

        // Handle image uploads if present
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imagePaths[] = $path;
            }
            $validated['images'] = $imagePaths;
        }

        Review::create($validated);

        return redirect()->back()->with('success', 'Review submitted successfully and is pending approval.');
    }

    /**
     * Display user's reviews
     */
    public function myReviews(): Response
    {
        $reviews = Review::where('user_id', Auth::id())
            ->with('product')
            ->latest()
            ->paginate(10);

        return Inertia::render('Profile/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Mark review as helpful
     */
    public function markHelpful(Review $review): RedirectResponse
    {
        $review->increment('is_helpful');
        
        return redirect()->back()->with('success', 'Thank you for your feedback!');
    }

    /**
     * Report a review
     */
    public function report(Request $request, Review $review): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $review->update([
            'is_reported' => true,
            'report_reason' => $validated['reason'],
        ]);

        return redirect()->back()->with('success', 'Review reported successfully.');
    }
}
