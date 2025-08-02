'use server';

/**
 * @fileOverview Test case generation AI agent.
 *
 * - generateTestCases - A function that handles the test case generation process from a URL.
 * - GenerateTestCasesInput - The input type for the generateTestCases function.
 * - GenerateTestCasesOutput - The return type for the generateTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesInputSchema = z.object({
  url: z.string().url().describe('The URL of the e-commerce website to test.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const GenerateTestCasesOutputSchema = z.object({
  testCases: z.array(
    z.object({
      title: z.string().describe('The title of the test case.'),
      description: z.string().describe('A detailed description of the test case.'),
      steps: z.array(z.string()).describe('A list of steps to execute the test case.'),
      expectedResult: z.string().describe('The expected result of the test case.'),
    })
  ).describe('A list of generated test cases.'),
});
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const generateTestCasesPrompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are a QA engineer specializing in e-commerce website testing. Based on the URL provided, generate a comprehensive set of test cases covering key functionalities such as browsing products, adding items to the cart, placing orders, and making payments.

Consider common e-commerce flows and potential issues. Each test case should include a title, a detailed description, a list of steps, and the expected result.

URL: {{{url}}}

Output the test cases in JSON format.`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await generateTestCasesPrompt(input);
    return output!;
  }
);
