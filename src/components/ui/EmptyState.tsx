import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/40 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-primary">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-secondary">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
