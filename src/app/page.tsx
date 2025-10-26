'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockEmails as initialEmails } from '@/lib/data';
import type { Email, EmailCategory } from '@/lib/types';
import { categorizeEmail } from '@/ai/flows/categorize-emails';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { EmailList } from '@/components/email-list';
import { EmailDisplay } from '@/components/email-display';

export default function HomePage() {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [selectedCategory, setSelectedCategory] = useState<
    EmailCategory | 'All' | 'Unread'
  >('All');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  useEffect(() => {
    if (emails.length > 0 && !selectedEmailId) {
      setSelectedEmailId(emails[0].id);
    }
  }, [emails, selectedEmailId]);

  const selectedEmail = useMemo(
    () => emails.find((e) => e.id === selectedEmailId) || null,
    [emails, selectedEmailId]
  );

  const filteredEmails = useMemo(() => {
    if (selectedCategory === 'All') return emails;
    if (selectedCategory === 'Unread') return emails.filter((e) => !e.read);
    return emails.filter((e) => e.category === selectedCategory);
  }, [emails, selectedCategory]);

  const unreadCounts = useMemo(() => {
    const counts = emails.reduce(
      (acc, email) => {
        if (!email.read) {
          acc.All = (acc.All || 0) + 1;
          if (email.category) {
            acc[email.category] = (acc[email.category] || 0) + 1;
          } else {
            // To ensure even uncategorized unread emails are counted for 'All'
          }
        }
        return acc;
      },
      {} as Record<string, number>
    );
    counts.Unread = counts.All;
    return counts;
  }, [emails]);

  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, read: true } : e))
    );
  };

  const handleCategorize = async (email: Email) => {
    try {
      const result = await categorizeEmail({
        subject: email.subject,
        body: email.body,
      });
      setEmails((prev) =>
        prev.map((e) =>
          e.id === email.id
            ? { ...e, category: result.category as EmailCategory }
            : e
        )
      );
      toast({
        title: 'Email Categorized',
        description: `Moved to "${result.category}". Reason: ${result.reason}`,
      });
      return result.category as EmailCategory;
    } catch (error) {
      console.error('Failed to categorize email:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not categorize the email.',
      });
      return email.category;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <Sidebar collapsible="icon" className="max-w-[280px]">
          <AppSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            unreadCounts={unreadCounts}
          />
        </Sidebar>
        <SidebarInset>
          <div className="grid md:grid-cols-[minmax(300px,400px)_1fr] h-full">
            <div className="h-full border-r">
              <EmailList
                emails={filteredEmails}
                selectedEmailId={selectedEmailId}
                onSelectEmail={handleSelectEmail}
              />
            </div>
            <div className="h-full">
              <EmailDisplay
                email={selectedEmail}
                onCategorize={handleCategorize}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
