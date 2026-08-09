const officialLinks = [
  ['Play on Steam', 'https://store.steampowered.com/app/1368140/Corsair_Cove/'],
  ['View on Microsoft Store', 'https://www.xbox.com/en-US/games/store/corsair-cove/9PHS0189K408'],
  ['Official Wiki', 'https://wiki.hoodedhorse.com/Corsair_Cove/Corsair_Cove_Official_Wiki'],
  ['Official Discord', 'https://discord.com/invite/tz5jxS4yt9'],
  ['Limbic Entertainment on YouTube', 'https://www.youtube.com/@LimbicEntertainment'],
  ['Developer Website', 'https://www.limbic-entertainment.de'],
] as const

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Official Corsair Cove links">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {officialLinks.map(([label, href]) => (
              <li key={href}>
                <a className="underline decoration-border underline-offset-4 hover:text-nav-theme" href={href} rel="noreferrer" target="_blank">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
          Corsair Cove Wiki is an independent fan site and is not affiliated with, endorsed by, or sponsored by Limbic Entertainment or Hooded Horse.
        </p>
      </div>
    </footer>
  )
}
