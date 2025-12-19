<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    /**
     * Display a listing of contact messages.
     * @route GET /api/contacts
     * @access Admin only
     */
    public function index(Request $request)
    {
        try {
            $query = Contact::query();

            // Filter by status
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }

            // Search by name, email, or subject
            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%");
                });
            }

            // Date range filter
            if ($request->has('from_date') && $request->from_date !== '') {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            if ($request->has('to_date') && $request->to_date !== '') {
                $query->whereDate('created_at', '<=', $request->to_date);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $contacts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $contacts->items(),
                'pagination' => [
                    'current_page' => $contacts->currentPage(),
                    'per_page' => $contacts->perPage(),
                    'total' => $contacts->total(),
                    'last_page' => $contacts->lastPage(),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching contacts: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contact messages',
            ], 500);
        }
    }

    /**
     * Store a new contact message and send email notification.
     * @route POST /api/contact
     * @access Public
     */
    public function store(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:50',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:5000',
            ], [
                'name.required' => 'Name is required',
                'email.required' => 'Email is required',
                'email.email' => 'Please provide a valid email address',
                'subject.required' => 'Subject is required',
                'message.required' => 'Message is required',
            ]);

            // Create contact record
            $contact = Contact::create($validated);

            // Send email notification
            $this->sendContactEmail($contact);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully! We will get back to you soon.',
                'data' => $contact,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.',
            ], 500);
        }
    }

    /**
     * Display a single contact message.
     * @route GET /api/contacts/{id}
     * @access Admin only
     */
    public function show(string $id)
    {
        try {
            $contact = Contact::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $contact,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact message not found',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching contact: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contact message',
            ], 500);
        }
    }

    /**
     * Update contact status or add admin notes.
     * @route PUT/PATCH /api/contacts/{id}
     * @access Admin only
     */
    public function update(Request $request, string $id)
    {
        try {
            $contact = Contact::findOrFail($id);

            // Validate request
            $validated = $request->validate([
                'status' => ['nullable', Rule::in(['new', 'in_progress', 'resolved'])],
                'admin_notes' => 'nullable|string|max:5000',
            ]);

            // Update only provided fields
            if ($request->has('status')) {
                $contact->status = $validated['status'];
            }
            if ($request->has('admin_notes')) {
                $contact->admin_notes = $validated['admin_notes'];
            }

            $contact->save();

            return response()->json([
                'success' => true,
                'message' => 'Contact message updated successfully',
                'data' => $contact,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact message not found',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating contact: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update contact message',
            ], 500);
        }
    }

    /**
     * Delete a contact message.
     * @route DELETE /api/contacts/{id}
     * @access Admin only
     */
    public function destroy(string $id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact message deleted successfully',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact message not found',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting contact: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact message',
            ], 500);
        }
    }

    /**
     * Send email notification for new contact message
     * 
     * @param Contact $contact
     * @return void
     */
    private function sendContactEmail(Contact $contact)
    {
        try {
            Mail::send([], [], function ($message) use ($contact) {
                $message->to(config('mail.contact_to', 'info@axgphoto.com'))
                    ->subject('Contact Form: ' . $contact->subject)
                    ->replyTo($contact->email, $contact->name)
                    ->html($this->getEmailTemplate($contact));
            });
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::error('Failed to send contact email: ' . $e->getMessage());
        }
    }

    /**
     * Generate HTML email template
     * 
     * @param Contact $contact
     * @return string
     */
    private function getEmailTemplate(Contact $contact)
    {
        $message = nl2br(htmlspecialchars($contact->message));
        $phone = $contact->phone ? "<p><strong>Phone:</strong> {$contact->phone}</p>" : '';

        return "
        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
          <h2 style=\"color: #1d1d1b; border-bottom: 2px solid #404040; padding-bottom: 10px;\">
            New Contact Form Submission
          </h2>
          
          <div style=\"background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;\">
            <p><strong>Name:</strong> {$contact->name}</p>
            <p><strong>Email:</strong> {$contact->email}</p>
            {$phone}
            <p><strong>Subject:</strong> {$contact->subject}</p>
          </div>
          
          <div style=\"background-color: #ffffff; padding: 20px; border-left: 4px solid #1d1d1b; margin: 20px 0;\">
            <h3 style=\"color: #1d1d1b; margin-top: 0;\">Message:</h3>
            <p style=\"line-height: 1.6; color: #333;\">{$message}</p>
          </div>
          
          <div style=\"margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;\">
            <p>This message was sent from the AXG Photo website contact form.</p>
            <p>Reply directly to this email to respond to {$contact->name} at {$contact->email}</p>
          </div>
        </div>
        ";
    }
}
