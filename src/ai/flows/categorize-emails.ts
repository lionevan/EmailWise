'use server';

/**
 * @fileOverview This file defines a Genkit flow for categorizing incoming emails.
 *
 * - categorizeEmail - A function that categorizes an email based on its content.
 * - CategorizeEmailInput - The input type for the categorizeEmail function, containing the email subject and body.
 * - CategorizeEmailOutput - The return type for the categorizeEmail function, indicating the email's category.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeEmailInputSchema = z.object({
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The main content of the email.'),
});
export type CategorizeEmailInput = z.infer<typeof CategorizeEmailInputSchema>;

const CategorizeEmailOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category of the email, chosen from: Personal, Work, Social, Promotions, Updates, or Other.'
    ),
  reason: z.string().optional().describe('The reason for the predicted category.'),
});
export type CategorizeEmailOutput = z.infer<typeof CategorizeEmailOutputSchema>;

export async function categorizeEmail(input: CategorizeEmailInput): Promise<CategorizeEmailOutput> {
  return categorizeEmailFlow(input);
}

const categorizeEmailPrompt = ai.definePrompt({
  name: 'categorizeEmailPrompt',
  input: {schema: CategorizeEmailInputSchema},
  output: {schema: CategorizeEmailOutputSchema},
  prompt: `You are an email categorization expert. Analyze the email content and assign it to one of the following categories:

- Personal: Emails from family, friends, or personal contacts.
- Work: Emails related to work, projects, or professional communication.
- Social: Emails from social media platforms or online communities.
- Promotions: Marketing emails, discounts, or special offers.
- Updates: Notifications, news, or informational updates.
- Other: Any email that does not fit into the above categories.

Subject: {{{subject}}}
Body: {{{body}}}

Provide the email category. Respond in JSON format, and include a brief explanation for the email category prediction in the \"reason\" field.
`,
});

const categorizeEmailFlow = ai.defineFlow(
  {
    name: 'categorizeEmailFlow',
    inputSchema: CategorizeEmailInputSchema,
    outputSchema: CategorizeEmailOutputSchema,
  },
  async input => {
    const {output} = await categorizeEmailPrompt(input);
    return output!;
  }
);
