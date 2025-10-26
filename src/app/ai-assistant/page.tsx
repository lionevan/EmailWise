'use client';

import * as React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowUp,
  Mail,
  Zap,
  BookText,
  AlertTriangle,
} from 'lucide-react';
import { mockEmails } from '@/lib/data';
import type { Email } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { categorizeEmail } from '@/ai/flows/categorize-emails';

const agentActions = [
  {
    title: 'Categorize all new emails',
    icon: Mail,
    action: 'categorize',
  },
  {
    title: 'Generate draft responses for urgent emails',
    icon: Zap,
    action: 'draft',
  },
  {
    title: "Summarize today's emails",
    icon: BookText,
    action: 'summarize',
  },
  {
    title: 'Identify emails requiring immediate attention',
    icon: AlertTriangle,
    action: 'identify',
  },
];

export default function AiAssistantPage() {
  const [emails, setEmails] = React.useState<Email[]>(mockEmails);
  const [inputValue, setInputValue] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { toast } = useToast();

  const handleAgentAction = async (action: string) => {
    setIsProcessing(true);
    if (action === 'categorize') {
      toast({
        title: 'Categorizing emails...',
        description: 'The AI is analyzing and categorizing your new emails.',
      });

      const updatedEmails = await Promise.all(
        emails.map(async (email) => {
          if (!email.category) {
            try {
              const result = await categorizeEmail({
                subject: email.subject,
                body: email.body,
              });
              return { ...email, category: result.category as any };
            } catch (error) {
              console.error('Failed to categorize email:', email.id, error);
              return email;
            }
          }
          return email;
        })
      );
      setEmails(updatedEmails);
      toast({
        title: 'Categorization Complete!',
        description: 'Your new emails have been successfully categorized.',
      });
    } else {
       toast({
        title: 'Action not implemented',
        description: 'This AI agent action is not yet available.',
        variant: 'destructive'
      });
    }
    setIsProcessing(false);
    setInputValue('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(inputValue.trim()) {
       handleAgentAction(inputValue.trim().toLowerCase());
    }
  };


  return (
    <SidebarInset>
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 md:hidden">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
          <h1 className="text-xl font-bold">AI Assistant</h1>
        </div>
      </header>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Advanced AI Agent
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Your smart assistant for managing your inbox. Tell the agent
                what you need, or choose a suggested action.
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Suggested Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentActions.map((item) => (
                  <Button
                    key={item.title}
                    variant="outline"
                    className="h-auto p-4 justify-start items-center gap-4"
                    onClick={() => handleAgentAction(item.action)}
                    disabled={isProcessing}
                  >
                    <item.icon className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium text-left whitespace-normal">
                      {item.title}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-4 bg-background/95 backdrop-blur-sm border-t">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  placeholder="Tell the agent what to do... e.g., 'Summarize today`s emails'"
                  className="pr-12 h-12 text-base"
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  disabled={isProcessing || !inputValue.trim()}
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
