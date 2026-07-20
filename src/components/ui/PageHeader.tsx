interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <h1 className="text-display text-primary">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
