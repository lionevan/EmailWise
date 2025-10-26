'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating email responses based on user-provided prompts and examples.
 *
 * - generateEmailResponse - A function that generates an email response.
 * - GenerateEmailResponseInput - The input type for the generateEmailResponse function.
 * - GenerateEmailResponseOutput - The return type for the generateEmailResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailResponseInputSchema = z.object({
  emailContent: z.string().describe('The content of the email to respond to.'),
  userPrompt: z.string().describe('A prompt from the user to guide the response generation.'),
  exampleResponses: z.string().describe('Example responses from customers, family, or friends to learn from.'),
});

export type GenerateEmailResponseInput = z.infer<typeof GenerateEmailResponseInputSchema>;

const GenerateEmailResponseOutputSchema = z.object({
  generatedResponse: z.string().describe('The generated email response.'),
});

export type GenerateEmailResponseOutput = z.infer<typeof GenerateEmailResponseOutputSchema>;

export async function generateEmailResponse(input: GenerateEmailResponseInput): Promise<GenerateEmailResponseOutput> {
  return generateEmailResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailResponsePrompt',
  input: {schema: GenerateEmailResponseInputSchema},
  output: {schema: GenerateEmailResponseOutputSchema},
  prompt: `You are an AI email assistant.  You will generate a response to an email based on the email content, a user-provided prompt, and example responses.

Email Content: {{{emailContent}}}
User Prompt: {{{userPrompt}}}
Example Responses: {{{exampleResponses}}}

Generate Response: `,
});

const generateEmailResponseFlow = ai.defineFlow(
  {
    name: 'generateEmailResponseFlow',
    inputSchema: GenerateEmailResponseInputSchema,
    outputSchema: GenerateEmailResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
