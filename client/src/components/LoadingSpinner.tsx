import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "rounded-full border-muted border-t-neon-cyan animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-muted border-t-neon-cyan animate-spin" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-neon-purple animate-spin animation-delay-150" style={{ animationDirection: "reverse" }} />
      </div>
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}

export function AppCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/80 p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-muted" />
        <div className="flex-1">
          <div className="h-5 bg-muted rounded w-2/3 mb-2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="h-4 bg-muted rounded w-20" />
        <div className="h-8 bg-muted rounded w-16" />
      </div>
    </div>
  );
}
