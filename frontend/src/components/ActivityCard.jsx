export default function ActivityCard({ title, items, renderItem }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">Nothing here yet.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item, index) => (
            <li
              key={item.id ?? index}
              className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-none last:pb-0"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
