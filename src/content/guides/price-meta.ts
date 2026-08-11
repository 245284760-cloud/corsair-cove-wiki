import { guideMetadataSchema } from '@/lib/content-schema'
import type { ReadonlyGuideMetadata } from '@/content/guides'

export const priceMeta: ReadonlyGuideMetadata = guideMetadataSchema.parse({
  slug: 'price',
  href: '/price/',
  title: 'Corsair Cove Price: Current Steam Region Snapshot',
  description: 'Check the dated Corsair Cove France price snapshot and use official stores for your current region and sale status.',
  primaryKeyword: 'corsair cove price',
  category: 'Game Info',
  directAnswer: 'Steam listed Corsair Cove at a €39.99 base price in France when checked on August 11, 2026, with a temporary €29.99 launch price through August 14. Store prices vary by region and sale, so check the official listing for your current local price.',
  verifiedOn: '2026-08-11',
  applicableVersion: 'Full release; France store snapshot checked 2026-08-11',
  toc: [
    { id: 'current-verified-price', label: 'Current Verified Price', level: 2 },
    { id: 'base-game-and-bundles', label: 'Base Game and Bundles', level: 2 },
    { id: 'regional-prices-and-sales', label: 'Regional Prices and Sales', level: 2 },
    { id: 'pc-game-pass-availability', label: 'PC Game Pass Availability', level: 2 },
    { id: 'official-purchase-links', label: 'Official Purchase Links', level: 2 },
  ],
  sources: [
    { label: 'Steam full game listing', url: 'https://store.steampowered.com/app/1368140/Corsair_Cove/' },
    { label: 'Xbox Wire Game Pass announcement', url: 'https://news.xbox.com/en-us/2026/07/21/xbox-game-pass-july-2026-wave-2/' },
  ],
  related: ['/platforms/', '/release-date/', '/system-requirements/'],
})
