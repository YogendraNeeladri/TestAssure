'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import type { TestCaseWithStatus } from './test-case-item';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CheckCircle2, CircleDashed, XCircle } from 'lucide-react';

export type ReportData = {
  summary: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
  };
  details: TestCaseWithStatus[];
};

type TestReportProps = {
  data: ReportData;
};

const chartConfig = {
    passed: { label: "Passed", color: "hsl(var(--chart-2))", icon: CheckCircle2 },
    failed: { label: "Failed", color: "hsl(var(--destructive))", icon: XCircle },
    pending: { label: "Pending", color: "hsl(var(--muted-foreground))", icon: CircleDashed },
} satisfies ChartConfig;


export function TestReport({ data }: TestReportProps) {
  const { summary, details } = data;
  const pieData = [
    { name: 'passed', value: summary.passed, fill: 'var(--color-passed)' },
    { name: 'failed', value: summary.failed, fill: 'var(--color-failed)' },
    { name: 'pending', value: summary.pending, fill: 'var(--color-pending)' },
  ].filter(item => item.value > 0);

  const totalExecuted = summary.passed + summary.failed;
  const passRate = totalExecuted > 0 ? (summary.passed / totalExecuted) * 100 : 0;

  const StatusBadge = ({ status }: { status: TestCaseWithStatus['status'] }) => {
    switch (status) {
      case 'passed':
        return <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Test Execution Report</CardTitle>
                <CardDescription>A summary of the automated test run.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-2 items-center">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 text-center">
                        <p className="text-3xl font-bold">{summary.total}</p>
                        <p className="text-sm text-muted-foreground">Total Tests</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-3xl font-bold text-[hsl(var(--chart-2))]">{summary.passed}</p>
                        <p className="text-sm text-muted-foreground">Passed</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-3xl font-bold text-destructive">{summary.failed}</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-3xl font-bold">{passRate.toFixed(0)}%</p>
                        <p className="text-sm text-muted-foreground">Pass Rate</p>
                    </Card>
                </div>
                 <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px] w-full">
                    <PieChart>
                         <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" hideLabel />}
                        />
                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2} strokeWidth={2}>
                            {pieData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} className="stroke-background" />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>Status of each individual test case.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Test Case Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((testCase) => (
                <TableRow key={testCase.id}>
                  <TableCell><StatusBadge status={testCase.status} /></TableCell>
                  <TableCell className="font-medium">{testCase.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
