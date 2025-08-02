import { TestTube2 } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="text-center space-y-2">
      <div className="flex items-center justify-center gap-3">
        <TestTube2 className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-headline">
          TestAssure
        </h1>
      </div>
      <p className="text-muted-foreground text-lg">
      Smart Automated Testing for Online Shopping Websites
      </p>
    </header>
  );
}
