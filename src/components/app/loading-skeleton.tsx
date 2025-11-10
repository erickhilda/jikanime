import { Card, CardContent, CardHeader } from '../ui/card';

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 12 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="h-full flex flex-col overflow-hidden p-0">
          <div className="w-full aspect-[3/4] bg-secondary-background animate-pulse" />
          <CardHeader className="flex-1">
            <div className="h-6 bg-secondary-background rounded animate-pulse" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-4 w-24 bg-secondary-background rounded animate-pulse mb-2" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-secondary-background rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-secondary-background rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

