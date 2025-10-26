import { subDays, format } from 'date-fns';
import type { Email } from './types';

export const mockEmails: Email[] = [
  {
    id: '1',
    fromName: 'Alex Johnson',
    fromEmail: 'alex.j@example.com',
    subject: 'Project Update & Next Steps',
    body: `Hi Team,

Just a quick update on the Phoenix project. We've successfully completed the initial design phase and are moving into development next week.

Please review the attached documents and come prepared for our Monday sync.

Best,
Alex`,
    read: false,
    date: format(subDays(new Date(), 1), 'do MMM'),
    category: 'Work',
  },
  {
    id: '2',
    fromName: 'Samantha Lee',
    fromEmail: 'samantha.lee@example.com',
    subject: 'Weekend Plans?',
    body: `Hey!

Are you free this weekend? Thinking of going for a hike on Saturday morning. Let me know if you're interested!

Catch up soon,
Sam`,
    read: false,
    date: format(subDays(new Date(), 2), 'do MMM'),
    category: 'Personal',
  },
  {
    id: '3',
    fromName: 'InnovateTech Conference',
    fromEmail: 'events@innovate.tech',
    subject: 'Your Ticket for InnovateTech 2024',
    body: `Dear Attendee,

Your ticket for InnovateTech 2024 is confirmed! We're excited to have you join us for the future of technology.

Your ticket QR code is attached.

See you there,
The InnovateTech Team`,
    read: true,
    date: format(subDays(new Date(), 2), 'do MMM'),
    category: 'Updates',
  },
  {
    id: '4',
    fromName: 'SocialConnect',
    fromEmail: 'no-reply@socialconnect.com',
    subject: 'You have a new friend request',
    body: `Hi there,

You have a new friend request from David Chen. Connect now to grow your network!

Thanks,
The SocialConnect Team`,
    read: false,
    date: format(subDays(new Date(), 3), 'do MMM'),
    category: 'Social',
  },
  {
    id: '5',
    fromName: 'StyleHub',
    fromEmail: 'deals@stylehub.com',
    subject: 'Flash Sale: 50% Off Everything!',
    body: `Don't miss out!

Our biggest flash sale of the year is happening now. Get 50% off sitewide for the next 24 hours only.

Shop Now!`,
    read: true,
    date: format(subDays(new Date(), 4), 'do MMM'),
    category: 'Promotions',
  },
  {
    id: '6',
    fromName: 'Mom',
    fromEmail: 'mom@family.com',
    subject: 'Dinner on Sunday',
    body: `Hi sweetie,

Just wanted to check if you're still good for dinner this Sunday at our place. Around 6 PM?

Let me know!

Love,
Mom`,
    read: false,
    date: format(subDays(new Date(), 5), 'do MMM'),
    category: 'Personal',
  },
  {
    id: '7',
    fromName: 'HR Department',
    fromEmail: 'hr@corp.inc',
    subject: 'Important: Annual Performance Review',
    body: `Dear Employee,

This is a reminder to complete your self-assessment for the annual performance review by the end of this week.

Please log in to the employee portal to complete the required forms.

Thank you,
Human Resources`,
    read: true,
    date: format(subDays(new Date(), 6), 'do MMM'),
    category: 'Work',
  },
  {
    id: '8',
    fromName: 'Your Cloud Provider',
    fromEmail: 'billing@cloudservice.io',
    subject: 'Your monthly invoice is ready',
    body: `Hi,

Your invoice for the previous month is now available for viewing and payment.

Total amount due: $24.50

Thanks for being a customer,
Cloud Services Inc.`,
    read: true,
    date: format(subDays(new Date(), 7), 'do MMM'),
    category: 'Updates',
  },
  {
    id: '9',
    fromName: 'BookFair',
    fromEmail: 'newsletter@bookfair.com',
    subject: 'New arrivals you might like',
    body: `Based on your recent purchases, we think you'll love these new titles!

- The Midnight Library by Matt Haig
- Project Hail Mary by Andy Weir

Explore more new releases on our website.`,
    read: false,
    date: format(subDays(new Date(), 8), 'do MMM'),
  },
  {
    id: '10',
    fromName: 'Dr. Emily Carter',
    fromEmail: 'e.carter@university.edu',
    subject: 'Research Collaboration Inquiry',
    body: `Dear Colleague,

I came across your recent paper on quantum computing and was very impressed. I'm working on a related project and would be interested in exploring a potential collaboration.

Would you be available for a brief call next week?

Sincerely,
Dr. Emily Carter`,
    read: true,
    date: format(subDays(new Date(), 10), 'do MMM'),
    category: 'Work',
  },
];
