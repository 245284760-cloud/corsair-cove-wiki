export function StatsStrip({ stats }: Readonly<{ stats: readonly string[] }>) {
  return (
    <section aria-label="Corsair Cove at a glance" className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {stats.map((stat) => (
          <p key={stat} className="py-5 text-center text-sm font-semibold text-nav-theme sm:text-base">
            {stat}
          </p>
        ))}
      </div>
    </section>
  )
}
