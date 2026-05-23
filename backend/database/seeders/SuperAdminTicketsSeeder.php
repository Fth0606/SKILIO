<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuperAdminTicketsSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = DB::table('tenants')->get();
        $users = DB::table('users')->whereIn('role', ['student', 'teacher', 'tenant_admin'])->get();
        
        if ($tenants->isEmpty()) {
            $this->command->warn('No tenants found. Please run TenantsSeeder first.');
            return;
        }

        $ticketSubjects = [
            'Cannot access my account after password reset',
            'Payment failed but credits not deducted',
            'Session booking not working properly',
            'Need help with creating a skill listing',
            'Video call quality is very poor',
            'Cannot upload profile picture',
            'Billing statement incorrect for this month',
            'Feature request: Calendar integration',
            'Student cannot see my availability',
            'App crashes when opening notifications',
            'Need to upgrade my subscription plan',
            'How to add multiple skills at once?',
            'Session completed but credits not transferred',
            'Email notifications not being received',
            'Account suspended without explanation',
        ];

        $ticketMessages = [
            'I have been trying to log in for the past hour but keep getting an error message. I already reset my password but nothing works.',
            'I tried to book a session but the payment went through and now I have been charged twice. Please refund the extra credits.',
            'The booking system keeps giving me an error when I try to select a time slot. I have tried multiple browsers.',
            'I want to add more skills to my profile but the interface is confusing. Can someone guide me?',
            'The video quality during my sessions is extremely poor. Both parties have good internet connection.',
            'I am trying to upload my profile picture but it keeps failing. The file size is under 2MB.',
            'My billing statement shows charges from last month but I already paid. Please review and correct.',
            'It would be great if you could integrate with Google Calendar. This would help us schedule sessions better.',
            'One of my students says they cannot see my available time slots even though I have set them up.',
            'Every time I click on the notification bell, the app crashes. I am using the latest version.',
            'I would like to upgrade from Academy to Enterprise plan. What is the process?',
            'Is there a way to add multiple skills in one go instead of one at a time?',
            'I completed a session but the teacher has not received the credits yet. It has been 24 hours.',
            'I am not receiving any email notifications even though I have checked my spam folder.',
            'My account was suspended without any notice or explanation. I have been a loyal customer for 2 years.',
        ];

        $statuses = ['open', 'in_progress', 'resolved', 'closed'];
        $priorities = ['low', 'medium', 'high', 'urgent'];

        // Create 15 support tickets
        for ($i = 0; $i < 15; $i++) {
            $user = $users->isNotEmpty() ? $users[rand(0, min($users->count() - 1, 9))] : null;
            $tenant = $tenants->isNotEmpty() ? $tenants[rand(0, min($tenants->count() - 1, 9))] : null;
            
            $status = $statuses[array_rand($statuses)];
            $priority = $priorities[array_rand($priorities)];
            
            $createdAt = now()->subDays(rand(1, 30));
            $resolvedAt = in_array($status, ['resolved', 'closed']) ? $createdAt->copy()->addDays(rand(1, 5)) : null;
            
            DB::table('support_tickets')->insert([
                'tenant_id' => $tenant ? $tenant->id : 1,
                'user_id' => $user ? $user->id : 1,
                'session_request_id' => null,
                'subject' => $ticketSubjects[$i % count($ticketSubjects)],
                'message' => $ticketMessages[$i % count($ticketMessages)],
                'status' => $status,
                'priority' => $priority,
                'assigned_to' => $i < 5 ? 1 : null, // First 5 assigned to super admin
                'resolved_at' => $resolvedAt,
                'created_at' => $createdAt,
                'updated_at' => now(),
            ]);
        }

        // Create ticket replies for some tickets
        $this->createTicketReplies();

        $this->command->info('✓ SuperAdmin Tickets seeded: 15 tickets');
    }

    private function createTicketReplies()
    {
        $tickets = DB::table('support_tickets')->limit(5)->get();
        $admins = DB::table('users')->where('role', 'super_admin')->get();
        
        foreach ($tickets as $ticket) {
            // Add 1-3 replies per ticket
            $numReplies = rand(1, 3);
            
            for ($i = 0; $i < $numReplies; $i++) {
                $isAdmin = $i % 2 === 0; // Alternate between admin and user replies
                
                DB::table('ticket_replies')->insert([
                    'ticket_id' => $ticket->id,
                    'user_id' => $isAdmin && $admins->isNotEmpty() ? $admins->first()->id : $ticket->user_id,
                    'message' => $isAdmin 
                        ? 'Thank you for contacting support. We are looking into this issue and will get back to you shortly.'
                        : 'Any update on this issue? It has been a few days.',
                    'is_internal' => false,
                    'created_at' => now()->subDays(rand(1, 10)),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}