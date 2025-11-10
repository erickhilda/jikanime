import { Search } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export function EmptyState({
  message = 'No anime found',
  submessage = 'Try searching for something else',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-secondary-background flex items-center justify-center mb-4">
        <Search className="w-12 h-12 text-foreground/50" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-foreground/70 max-w-md">{submessage}</p>
    </div>
  );
}

