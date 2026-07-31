export default function StatCard({ label, value, icon: Icon, accentColor = "text-accent" }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-colors duration-150 hover:bg-surface-hover">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft ${accentColor}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="mt-4 text-3xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}
