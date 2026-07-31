export default function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        flex flex-col
        w-full
        rounded-xl
        border border-border
        bg-surface
        p-5
        transition-all
        duration-200
        hover:bg-surface-hover
        ${className}
      `}
    >
      {(title || subtitle) && (
        <header className="mb-5">
          {title && (
            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          )}

          {subtitle && (
            <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
          )}
        </header>
      )}

      <div className="flex flex-col flex-1">{children}</div>
    </section>
  );
}
