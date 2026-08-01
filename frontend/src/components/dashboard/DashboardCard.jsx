export default function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section
      className={`
        flex h-full flex-col
        w-full
        rounded-2xl
        border border-border
        bg-surface
        p-5 sm:p-6
        transition-colors
        duration-200
        hover:border-border-strong
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon size={16} />
              </div>
            )}

            <div>
              {title && (
                <h3 className="text-sm font-semibold tracking-tight text-text-primary">
                  {title}
                </h3>
              )}

              {subtitle && (
                <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
              )}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}

      <div className={`flex flex-1 flex-col ${bodyClassName}`}>{children}</div>
    </section>
  );
}
