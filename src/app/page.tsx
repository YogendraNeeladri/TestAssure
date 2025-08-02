'use client';

import { useState } from 'react';
import type { GenerateTestCasesOutput } from '@/ai/flows/generate-test-cases';
import { AppHeader } from '@/components/app-header';
import { UrlForm } from '@/components/url-form';
import { TestCaseList } from '@/components/test-case-list';
import { TestReport, type ReportData } from '@/components/test-report';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<GenerateTestCasesOutput['testCases'] | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleTestCasesGenerated = (data: GenerateTestCasesOutput) => {
    setTestCases(data.testCases);
    setIsLoading(false);
    setError(null);
    setReport(null);
    setShowReport(false);
  };

  const handleReset = () => {
    setIsLoading(false);
    setError(null);
    setTestCases(null);
    setReport(null);
    setShowReport(false);
  }

  if (showReport && report) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl">
          <Button variant="ghost" onClick={() => setShowReport(false)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Test Cases
          </Button>
          <TestReport data={report} />
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <AppHeader />
        <UrlForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          onTestCasesGenerated={handleTestCasesGenerated}
          onReset={handleReset}
          hasTestCases={!!testCases}
        />
        {error && <p className="text-destructive text-center">{error}</p>}
        {testCases && (
          <TestCaseList
            initialTestCases={testCases}
            setReport={setReport}
            setShowReport={setShowReport}
          />
        )}
      </div>
    </main>
  );
}
