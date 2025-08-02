'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { CheckCircle2, CircleDashed, Edit, Loader2, Play, Save, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GenerateTestCasesOutput } from '@/ai/flows/generate-test-cases';
import { Card } from '@/components/ui/card';

export type TestCaseWithStatus = GenerateTestCasesOutput['testCases'][0] & {
  id: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
};

type TestCaseItemProps = {
  testCase: TestCaseWithStatus;
  onUpdate: (id: string, updatedCase: TestCaseWithStatus) => void;
  onStatusChange: (status: TestCaseWithStatus['status']) => void;
  isExecutingAll: boolean;
};

export function TestCaseItem({ testCase, onUpdate, onStatusChange, isExecutingAll }: TestCaseItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCase, setEditedCase] = useState(testCase);

  const handleSave = () => {
    onUpdate(testCase.id, editedCase);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCase(testCase);
    setIsEditing(false);
  };

  const handleRunTest = async () => {
    onStatusChange('running');
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
    const result: 'passed' | 'failed' = Math.random() > 0.3 ? 'passed' : 'failed';
    onStatusChange(result);
  };

  const statusIcons: Record<TestCaseWithStatus['status'], React.ReactNode> = {
    pending: <CircleDashed className="h-5 w-5 text-muted-foreground" />,
    running: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
    passed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    failed: <XCircle className="h-5 w-5 text-destructive" />,
  };
  
  const statusBorderColors: Record<TestCaseWithStatus['status'], string> = {
    pending: 'border-transparent',
    running: 'border-primary/50',
    passed: 'border-green-600/50',
    failed: 'border-destructive/50',
  }

  return (
    <Card className={cn("transition-colors", statusBorderColors[testCase.status])}>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={testCase.id} className="border-b-0">
                <AccordionTrigger className="hover:no-underline px-4 py-2 text-sm sm:text-base">
                    <div className="flex items-center gap-3 w-full">
                        {statusIcons[testCase.status]}
                        <span className="flex-1 text-left font-medium truncate">{isEditing ? editedCase.title : testCase.title}</span>
                        {!isEditing && (
                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} disabled={isExecutingAll}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleRunTest(); }} disabled={testCase.status === 'running' || isExecutingAll}>
                                    <Play className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                {isEditing ? (
                    <div className="space-y-4 pt-2 border-t -mx-4 px-4 pt-4">
                        <div className="space-y-1">
                            <Label htmlFor={`title-${testCase.id}`}>Title</Label>
                            <Input id={`title-${testCase.id}`} value={editedCase.title} onChange={(e) => setEditedCase({ ...editedCase, title: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`desc-${testCase.id}`}>Description</Label>
                            <Textarea id={`desc-${testCase.id}`} value={editedCase.description} onChange={(e) => setEditedCase({ ...editedCase, description: e.target.value })} rows={2} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`steps-${testCase.id}`}>Steps (one per line)</Label>
                            <Textarea id={`steps-${testCase.id}`} value={editedCase.steps.join('\n')} onChange={(e) => setEditedCase({ ...editedCase, steps: e.target.value.split('\n') })} rows={4} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`expected-${testCase.id}`}>Expected Result</Label>
                            <Textarea id={`expected-${testCase.id}`} value={editedCase.expectedResult} onChange={(e) => setEditedCase({ ...editedCase, expectedResult: e.target.value })} rows={2} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={handleCancel}><X className="mr-2 h-4 w-4"/>Cancel</Button>
                            <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90"><Save className="mr-2 h-4 w-4"/>Save</Button>
                        </div>
                    </div>
                ) : (
                    <div className="border-t -mx-4 px-4 pt-4 space-y-4">
                        <p className="text-muted-foreground">{testCase.description}</p>
                        <div>
                            <h4 className="font-semibold mb-2">Steps:</h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm pl-2">
                                {testCase.steps.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Expected Result:</h4>
                            <p className="text-sm bg-muted p-3 rounded-md">{testCase.expectedResult}</p>
                        </div>
                    </div>
                )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
  );
}
