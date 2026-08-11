import { describe, expect, it } from 'vitest'
import { guideMetadataSchema, homeContentSchema } from '@/lib/content-schema'

const validGuide = {
  slug: 'tips',
  href: '/tips/',
  title: 'Corsair Cove Tips',
  description: 'Verified beginner guidance for Corsair Cove logistics.',
  primaryKeyword: 'corsair cove tips',
  category: 'Beginner guides',
  directAnswer: 'Check connections and available workers before expanding.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'Full release; sources checked 2026-08-08',
  toc: [{ id: 'first-checks', label: 'First checks', level: 2 }],
  sources: [
    { label: 'Official Wiki', url: 'https://wiki.hoodedhorse.com/Corsair_Cove' },
    { label: 'Steam', url: 'https://store.steampowered.com/app/1368140/' },
  ],
  related: ['/how-to-get-more-drifters/'],
}

const validHomeContent = {
  home: {
    meta: { title: 'Corsair Cove Wiki', description: 'Verified Corsair Cove guides.' },
    hero: {
      eyebrow: 'Independent Fan-Made Strategy Guide',
      title: 'Corsair Cove Wiki',
      description: 'Build a pirate stronghold.',
      stats: ['Released Jul 31, 2026'],
      primaryCta: 'Read tips',
      primaryCtaHref: '/tips/',
      secondaryCta: 'Explore guides',
      secondaryCtaHref: '/guides/',
      videoLabel: 'Official Gameplay Trailer',
    },
    start: {
      eyebrow: 'Start Here',
      title: 'Build Your First Stronghold',
      cards: [{ title: 'Beginner Tips', description: 'Get started.', href: '/tips/' }],
    },
    gameInfo: {
      eyebrow: 'Game Information',
      title: 'Check Before You Buy or Play',
      cards: [
        { title: 'Platforms', description: 'Check platforms.', href: '/platforms/' },
        { title: 'Release Date', description: 'Check dates.', href: '/release-date/' },
        { title: 'Price', description: 'Check price.', href: '/price/' },
        { title: 'System Requirements', description: 'Check requirements.', href: '/system-requirements/' },
        { title: 'Troubleshooting', description: 'Fix issues.', href: '/troubleshooting/' },
      ],
    },
    aboutGame: {
      title: 'What is Corsair Cove?',
      paragraphs: ['Corsair Cove is a strategy game.'],
      stats: [{ label: 'Developer', value: 'Limbic Entertainment' }],
      cta: 'Explore all guides',
      ctaHref: '/guides/',
    },
    finalCta: {
      title: 'Ready to start?',
      description: 'Read verified guides.',
      primary: 'Read tips',
      primaryHref: '/tips/',
      secondary: 'View all guides',
      secondaryHref: '/guides/',
    },
  },
  footer: {
    aboutTitle: 'About Corsair Cove Wiki',
    about: 'An independent fan-made guide.',
    description: 'Verified guides.',
    playGame: 'Play on Steam',
    playGameHref: 'https://store.steampowered.com/app/1368140/',
    microsoftStore: 'Microsoft Store',
    microsoftStoreHref: 'https://www.xbox.com/games/',
    officialWiki: 'Official Wiki',
    officialWikiHref: 'https://wiki.hoodedhorse.com/Corsair_Cove',
    officialDiscord: 'Official Discord',
    officialDiscordHref: 'https://discord.com/invite/corsair-cove',
    officialYoutube: 'Official YouTube',
    officialYoutubeHref: 'https://www.youtube.com/@LimbicEntertainment',
    developerWebsite: 'Developer website',
    developerWebsiteHref: 'https://www.limbic-entertainment.de',
    copyrightNotice: 'Independent fan site.',
  },
  metadata: {
    title: 'Corsair Cove Wiki',
    description: 'Verified Corsair Cove guides.',
    keywords: 'corsair cove wiki, guides',
  },
  theme: {
    defaultMode: 'light',
    light: { navigation: '187 72% 37%', highlight: '187 68% 47%', contentBackground: '39 38% 88%' },
    dark: { navigation: '187 70% 44%', highlight: '42 88% 55%', pageBackground: '210 42% 16%' },
    accents: { pirateRed: '5 75% 53%', gold: '42 88% 55%' },
    officialBrandStandard: false,
  },
  languages: {
    initialReleaseScope: ['English'],
    priority: [{ rank: 1, language: 'English', localizedTitle: 'Corsair Cove Wiki' }],
    reassessAfter: 'Search Console data',
  },
  maintenance: {
    dynamicFactsIncludedInStableHomepage: false,
    refreshBeforePublication: ['price'],
    platformClaimLimit: 'Describe confirmed Windows PC availability only.',
  },
}

describe('published content schemas', () => {
  it('accepts a complete guide for a published guide route', () => {
    expect(guideMetadataSchema.parse(validGuide)).toMatchObject(validGuide)
  })

  it('rejects a guide route outside the published guide pages', () => {
    expect(() => guideMetadataSchema.parse({ ...validGuide, href: '/mods/' })).toThrow()
  })

  it('requires HTTPS evidence and an ISO verification date', () => {
    expect(() => guideMetadataSchema.parse({
      ...validGuide,
      sources: [
        { ...validGuide.sources[0], url: 'http://example.com' },
        validGuide.sources[1],
      ],
    })).toThrow()
    expect(guideMetadataSchema.parse({ ...validGuide, verifiedOn: '2026-08-09' })).toMatchObject({ verifiedOn: '2026-08-09' })
    expect(() => guideMetadataSchema.parse({ ...validGuide, verifiedOn: '2026-8-9' })).toThrow()
    expect(() => guideMetadataSchema.parse({ ...validGuide, verifiedOn: '2026-02-30' })).toThrow()
    expect(() => guideMetadataSchema.parse({ ...validGuide, verifiedOn: 'August 11, 2026' })).toThrow()
  })

  it('requires an H2 table of contents entry and two sources', () => {
    expect(() => guideMetadataSchema.parse({ ...validGuide, toc: [{ ...validGuide.toc[0], level: 3 }] })).toThrow()
    expect(() => guideMetadataSchema.parse({ ...validGuide, sources: [validGuide.sources[0]] })).toThrow()
  })

  it('rejects unpublished internal links from the home configuration', () => {
    expect(() => homeContentSchema.parse({
      ...validHomeContent,
      home: {
        ...validHomeContent.home,
        hero: { ...validHomeContent.home.hero, primaryCtaHref: '/mods/' },
      },
    })).toThrow()
  })
})
