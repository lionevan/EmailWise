'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEmailResponse } from '@/ai/flows/generate-email-response';
import type { Email, EmailCategory } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface EmailDisplayProps {
  email: Email | null;
  onCategorize: (email: Email) => Promise<EmailCategory | undefined>;
}

const responseFormSchema = z.object({
  userPrompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters long.'),
  exampleResponses: z.string().optional(),
});

type ResponseFormValues = z.infer<typeof responseFormSchema>;

export function EmailDisplay({ email, onCategorize }: EmailDisplayProps) {
  const { toast } = useToast();
  const [isCategorizing, setIsCategorizing] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedResponse, setGeneratedResponse] = React.useState('');

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: { userPrompt: '', exampleResponses: '' },
  });

  React.useEffect(() => {
    form.reset();
    setGeneratedResponse('');
  }, [email, form]);

  const handleCategorize = async () => {
    if (!email) return;
    setIsCategorizing(true);
    await onCategorize(email);
    setIsCategorizing(false);
  };

  const handleGenerateResponse = async (data: ResponseFormValues) => {
    if (!email) return;

    setIsGenerating(true);
    setGeneratedResponse('');

    try {
      const result = await generateEmailResponse({
        emailContent: email.body,
        userPrompt: data.userPrompt,
        exampleResponses: data.exampleResponses || '',
      });
      setGeneratedResponse(result.generatedResponse);
    } catch (error) {
      console.error('Failed to generate response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate a response.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!email) {
    return (
      <div className="flex h-full items-center justify-center bg-secondary/40">
        <p className="text-muted-foreground">
          Select an email to start reading.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>
                {email.fromName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{email.fromName}</p>
              <p className="text-sm text-muted-foreground">
                {email.fromEmail}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{email.date}</p>
            {email.category && (
              <Badge variant="outline" className="mt-1">
                {email.category}
              </Badge>
            )}
          </div>
        </div>
        <Separator className="my-4" />
        <h1 className="text-2xl font-bold">{email.subject}</h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 text-sm whitespace-pre-wrap">{email.body}</div>
      </ScrollArea>
      <div className="p-4 border-t bg-card">
        <Tabs defaultValue="response">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="response">AI Response</TabsTrigger>
            <TabsTrigger value="categorize">AI Categorization</TabsTrigger>
          </TabsList>
          <TabsContent value="response" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleGenerateResponse)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="userPrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Prompt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., 'Politely decline the invitation and suggest meeting next month.'"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="exampleResponses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Training Examples (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste example responses to train the AI on your style."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide examples from customers, family, or friends.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      disabled={isGenerating}
                    >
                      {isGenerating && (
                        <Loader2 className="animate-spin" />
                      )}
                      <span>Generate Response</span>
                    </Button>
                  </form>
                </Form>
                {generatedResponse && (
                  <div className="mt-6">
                    <Separator className="mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Suggested Response
                    </h3>
                    <Textarea
                      value={generatedResponse}
                      onChange={(e) => setGeneratedResponse(e.target.value)}
                      rows={8}
                      className="bg-secondary/50"
                    />
                     <Button className="mt-4">Send Reply</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categorize" className="mt-4">
            <Card>
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <p className="text-sm text-muted-foreground">
                  Let AI categorize this email for you. Current category is{' '}
                  <span className="font-semibold text-foreground">
                    {email.category || 'not set'}
                  </span>
                  .
                </p>
                <Button onClick={handleCategorize} disabled={isCategorizing}>
                  {isCategorizing && <Loader2 className="animate-spin" />}
                  Categorize with AI
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
