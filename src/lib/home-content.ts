import rawHomeContent from '@/content/homepage-content.json'
import { homeContentSchema } from '@/lib/content-schema'

export const homeContent = homeContentSchema.parse(rawHomeContent)
