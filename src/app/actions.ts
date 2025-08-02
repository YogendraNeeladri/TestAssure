'use server';

import { z } from 'zod';
import { generateTestCases, type GenerateTestCasesOutput } from '@/ai/flows/generate-test-cases';

const urlSchema = z.string().url({ message: 'Please enter a valid URL.' });

export async function handleGenerateTestCases(
  formData: FormData
): Promise<{ data: GenerateTestCasesOutput | null; error: string | null }> {
  const url = formData.get('url');

  const validationResult = urlSchema.safeParse(url);

  if (!validationResult.success) {
    return { data: null, error: validationResult.error.errors[0].message };
  }

  try {
    const result = await generateTestCases({ url: validationResult.data });
    if (!result.testCases || result.testCases.length === 0) {
        return { data: null, error: 'The AI could not generate test cases for this URL. Please try a different one.' };
    }
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Failed to generate test cases due to an unexpected error. Please try again.' };
  }
}
