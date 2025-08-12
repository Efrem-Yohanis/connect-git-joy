import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  variant?: "default" | "minimal" | "fullscreen";
}

export function Loading({ 
  size = "md", 
  text, 
  className,
  variant = "default" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-card border shadow-elegant">
          <div className="relative">
            <Loader2 className={cn(
              sizeClasses.lg,
              "animate-spin text-primary"
            )} />
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
          {text && (
            <p className={cn(textSizeClasses.lg, "text-muted-foreground animate-pulse")}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Loader2 className={cn(
          sizeClasses[size],
          "animate-spin text-primary"
        )} />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4 p-8",
      className
    )}>
      <div className="relative">
        <Loader2 className={cn(
          sizeClasses[size],
          "animate-spin text-primary"
        )} />
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      </div>
      {text && (
        <p className={cn(
          textSizeClasses[size], 
          "text-muted-foreground animate-pulse text-center"
        )}>
          {text}
        </p>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function LoadingSpinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  return <Loading variant="minimal" size={size} className={className} />;
}

export function LoadingPage({ text }: { text?: string }) {
  return <Loading variant="fullscreen" size="lg" text={text || "Loading..."} />;
}

export function LoadingCard({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card p-8", className)}>
      <Loading text={text || "Loading..."} />
    </div>
  );
}