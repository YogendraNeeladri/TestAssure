'use client';

import { useState } from 'react';
import { TestCaseItem, type TestCaseWithStatus } from './test-case-item';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ClipboardCheck, Loader2, Play } from 'lucide-react';
import { type GenerateTestCasesOutput } from '@/ai/flows/generate-test-cases';
import type { ReportData } from './test-report';
import { Progress } from '@/components/ui/progress';

type TestCaseListProps = {
  initialTestCases: GenerateTestCasesOutput['testCases'];
  setReport: (report: ReportData | null) => void;
  setShowReport: (show: boolean) => void;
};

export function TestCaseList({ initialTestCases, setReport, setShowReport }: TestCaseListProps) {
  const [testCases, setTestCases] = useState<TestCaseWithStatus[]>(
    initialTestCases.map((tc, index) => ({ ...tc, id: `case-${index}`, status: 'pending' }))
  );
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);

  const handleUpdateTestCase = (id: string, updatedCase: Partial<TestCaseWithStatus>) => {
    setTestCases(currentTestCases =>
      currentTestCases.map(tc => (tc.id === id ? { ...tc, ...updatedCase } : tc))
    );
  };
  
  const handleSaveTestCase = (id: string, updatedCase: TestCaseWithStatus) => {
    setTestCases(currentTestCases =>
        currentTestCases.map(tc => (tc.id === id ? updatedCase : tc))
    );
  }

  const runAllTests = async () => {
    setIsExecutingAll(true);
    setExecutionProgress(0);

    const updatedCases = testCases.map(tc => ({ ...tc, status: 'pending' as const }));
    setTestCases(updatedCases);
    
    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < updatedCases.length; i++) {
        handleUpdateTestCase(updatedCases[i].id, { status: 'running' });
        await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500));
        const result: 'passed' | 'failed' = Math.random() > 0.3 ? 'passed' : 'failed';
        handleUpdateTestCase(updatedCases[i].id, { status: result });
        setExecutionProgress(((i + 1) / updatedCases.length) * 100);
    }
    setIsExecutingAll(false);
  };

  const generateReport = () => {
    const passedCount = testCases.filter((tc) => tc.status === 'passed').length;
    const failedCount = testCases.filter((tc) => tc.status === 'failed').length;
    const pendingCount = testCases.filter((tc) => tc.status === 'pending' || tc.status === 'running').length;

    const reportData: ReportData = {
      summary: {
        total: testCases.length,
        passed: passedCount,
        failed: failedCount,
        pending: pendingCount,
      },
      details: testCases,
    };
    setReport(reportData);
    setShowReport(true);
  };
  
  const allTestsFinished = !isExecutingAll && testCases.every(tc => tc.status === 'passed' || tc.status === 'failed');

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>2. Review & Execute Tests</CardTitle>
        <CardDescription>
          Review, edit, and run the AI-generated test cases.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={runAllTests} disabled={isExecutingAll} className="w-full sm:w-auto flex-grow">
                {isExecutingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                {isExecutingAll ? `Executing... ${Math.round(executionProgress)}%` : 'Run All Tests'}
            </Button>
            <Button onClick={generateReport} disabled={!allTestsFinished} className="w-full sm:w-auto flex-grow">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Generate Report
            </Button>
        </div>

        {isExecutingAll && <Progress value={executionProgress} className="w-full" />}

        <div className="space-y-2">
          {testCases.map((testCase) => (
            <TestCaseItem
              key={testCase.id}
              testCase={testCase}
              onUpdate={handleSaveTestCase}
              onStatusChange={(status) => handleUpdateTestCase(testCase.id, { status })}
              isExecutingAll={isExecutingAll}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
