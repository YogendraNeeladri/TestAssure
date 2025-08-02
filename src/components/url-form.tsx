'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleGenerateTestCases } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, RefreshCw, TestTubeDiagonal } from 'lucide-react';
import type { GenerateTestCasesOutput } from '@/ai/flows/generate-test-cases';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type UrlFormProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  onTestCasesGenerated: (data: GenerateTestCasesOutput) => void;
  onReset: () => void;
  hasTestCases: boolean;
};

export function UrlForm({ isLoading, setIsLoading, setError, onTestCasesGenerated, onReset, hasTestCases }: UrlFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('url', values.url);

    const result = await handleGenerateTestCases(formData);

    setIsLoading(false);
    if (result.error) {
      setError(result.error);
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.data) {
      onTestCasesGenerated(result.data);
      toast({
        title: 'Success!',
        description: `${result.data.testCases.length} test cases generated.`,
      });
    }
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>1. Enter Application URL</CardTitle>
        <CardDescription>
          Provide the URL of the e-commerce application you want to test.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example-ecommerce.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" disabled={isLoading} className="flex-grow">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <TestTubeDiagonal className="mr-2 h-4 w-4" />
                    Generate Test Cases
                  </>
                )}
              </Button>
              {hasTestCases && (
                <Button type="button" variant="outline" onClick={onReset}>
                    <RefreshCw className="mr-2 h-4 w-4"/>
                    Start Over
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
