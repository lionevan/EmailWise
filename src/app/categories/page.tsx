'use client';

import React, { useState, useMemo } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { EmailList } from '@/components/email-list';
import { EmailDisplay } from '@/components/email-display';
import { mockEmails } from '@/lib/data';
import type { Email, EmailCategory } from '@/lib/types';
import { categorizeEmail } from '@/ai/flows/categorize-emails';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories: EmailCategory[] = [
  'Personal',
  'Work',
  'Social',
  'Promotions',
  'Updates',
  'Other',
];

export default function CategoriesPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(
    emails[0]?.id || null
  );
  const [activeCategory, setActiveCategory] = useState<EmailCategory | 'All'>(
    'All'
  );
  const { toast } = useToast();

  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, read: true } : email
      )
    );
  };

  const handleCategorizeEmail = async (emailToCategorize: Email) => {
    try {
      toast({
        title: 'Categorizing...',
        description: 'The AI is analyzing your email.',
      });
      const result = await categorizeEmail({
        subject: emailToCategorize.subject,
        body: emailToCategorize.body,
      });

      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email.id === emailToCategorize.id
            ? { ...email, category: result.category as EmailCategory }
            : email
        )
      );
      toast({
        title: 'Success!',
        description: `Email categorized as ${result.category}.`,
      });
      return result.category as EmailCategory;
    } catch (error) {
      console.error('Failed to categorize email:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not categorize the email.',
      });
    }
  };

  const selectedEmail = useMemo(
    () => emails.find((email) => email.id === selectedEmailId) || null,
    [emails, selectedEmailId]
  );
  
  const filteredEmails = useMemo(() => {
    if (activeCategory === 'All') {
      return emails;
    }
    return emails.filter((email) => email.category === activeCategory);
  }, [emails, activeCategory]);

  return (
    <SidebarInset>
      <div className="flex flex-col h-full">
         <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-3 flex items-center justify-between">
           <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 md:hidden" />
            <h1 className="text-xl font-bold">Categories</h1>
           </div>
        </header>

        <div className="p-4 border-b">
            <Tabs 
              value={activeCategory} 
              onValueChange={(value) => setActiveCategory(value as EmailCategory | 'All')}
            >
              <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
                <TabsTrigger value="All">All</TabsTrigger>
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
        </div>
        
        <div className="grid md:grid-cols-[350px_1fr] flex-1 overflow-hidden">
          <div className="border-r h-full overflow-y-auto">
            <EmailList
              emails={filteredEmails}
              selectedEmailId={selectedEmailId}
              onSelectEmail={handleSelectEmail}
            />
          </div>
          <div className="h-full overflow-y-auto">
            <EmailDisplay
              email={selectedEmail}
              onCategorize={handleCategorizeEmail}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
