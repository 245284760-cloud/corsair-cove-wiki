import { z } from 'zod'
import { GUIDE_ROUTES, PUBLIC_ROUTES } from '@/lib/routes'

const nonEmptyText = z.string().trim().min(1)
const httpsUrlSchema = z.string().url().refine((url) => url.startsWith('https://'), {
  message: 'URL must use HTTPS',
})
const publicRouteSchema = z.enum(PUBLIC_ROUTES)
const guideRouteSchema = z.enum(GUIDE_ROUTES)

const tocEntrySchema = z.object({
  id: nonEmptyText,
  label: nonEmptyText,
  level: z.literal(2),
}).strict()

const guideSourceSchema = z.object({
  label: nonEmptyText,
  url: httpsUrlSchema,
}).strict()

export const guideMetadataSchema = z.object({
  slug: nonEmptyText,
  href: guideRouteSchema,
  title: nonEmptyText,
  description: nonEmptyText,
  primaryKeyword: nonEmptyText,
  category: nonEmptyText,
  directAnswer: nonEmptyText,
  verifiedOn: z.iso.date(),
  applicableVersion: nonEmptyText,
  toc: z.array(tocEntrySchema).min(1),
  sources: z.array(guideSourceSchema).min(2),
  related: z.array(guideRouteSchema),
}).strict()

export type GuideSource = z.infer<typeof guideSourceSchema>
export type GuideMetadata = z.infer<typeof guideMetadataSchema>

const internalLinkSchema = publicRouteSchema
const linkLabelSchema = nonEmptyText

const homeCardSchema = z.object({
  title: nonEmptyText,
  description: nonEmptyText,
  href: internalLinkSchema,
}).strict()

const homeStatSchema = z.object({
  label: nonEmptyText,
  value: nonEmptyText,
}).strict()

export const homeContentSchema = z.object({
  home: z.object({
    meta: z.object({
      title: nonEmptyText,
      description: nonEmptyText,
    }).strict(),
    hero: z.object({
      eyebrow: nonEmptyText,
      title: nonEmptyText,
      description: nonEmptyText,
      stats: z.array(nonEmptyText).min(1),
      primaryCta: linkLabelSchema,
      primaryCtaHref: internalLinkSchema,
      secondaryCta: linkLabelSchema,
      secondaryCtaHref: internalLinkSchema,
      videoLabel: nonEmptyText,
    }).strict(),
    start: z.object({
      eyebrow: nonEmptyText,
      title: nonEmptyText,
      cards: z.array(homeCardSchema).min(1),
    }).strict(),
    aboutGame: z.object({
      title: nonEmptyText,
      paragraphs: z.array(nonEmptyText).min(1),
      stats: z.array(homeStatSchema).min(1),
      cta: linkLabelSchema,
      ctaHref: internalLinkSchema,
    }).strict(),
    finalCta: z.object({
      title: nonEmptyText,
      description: nonEmptyText,
      primary: linkLabelSchema,
      primaryHref: internalLinkSchema,
      secondary: linkLabelSchema,
      secondaryHref: internalLinkSchema,
    }).strict(),
  }).strict(),
  footer: z.object({
    aboutTitle: nonEmptyText,
    about: nonEmptyText,
    description: nonEmptyText,
    playGame: linkLabelSchema,
    playGameHref: httpsUrlSchema,
    microsoftStore: linkLabelSchema,
    microsoftStoreHref: httpsUrlSchema,
    officialWiki: linkLabelSchema,
    officialWikiHref: httpsUrlSchema,
    officialDiscord: linkLabelSchema,
    officialDiscordHref: httpsUrlSchema,
    officialYoutube: linkLabelSchema,
    officialYoutubeHref: httpsUrlSchema,
    developerWebsite: linkLabelSchema,
    developerWebsiteHref: httpsUrlSchema,
    copyrightNotice: nonEmptyText,
  }).strict(),
  metadata: z.object({
    title: nonEmptyText,
    description: nonEmptyText,
    keywords: nonEmptyText,
  }).strict(),
  theme: z.object({
    defaultMode: z.enum(['light', 'dark']),
    light: z.object({
      navigation: nonEmptyText,
      highlight: nonEmptyText,
      contentBackground: nonEmptyText,
    }).strict(),
    dark: z.object({
      navigation: nonEmptyText,
      highlight: nonEmptyText,
      pageBackground: nonEmptyText,
    }).strict(),
    accents: z.object({
      pirateRed: nonEmptyText,
      gold: nonEmptyText,
    }).strict(),
    officialBrandStandard: z.boolean(),
  }).strict(),
  languages: z.object({
    initialReleaseScope: z.tuple([z.literal('English')]),
    priority: z.array(z.object({
      rank: z.number().int().positive(),
      language: nonEmptyText,
      localizedTitle: nonEmptyText,
    }).strict()).min(1),
    reassessAfter: nonEmptyText,
  }).strict(),
  maintenance: z.object({
    dynamicFactsIncludedInStableHomepage: z.literal(false),
    refreshBeforePublication: z.array(nonEmptyText),
    platformClaimLimit: nonEmptyText,
  }).strict(),
}).strict()

export type HomeContent = z.infer<typeof homeContentSchema>
