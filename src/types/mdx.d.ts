declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { ReadonlyGuideMetadata } from '@/content/guides'

  export const guideMeta: ReadonlyGuideMetadata
  const MDXContent: ComponentType
  export default MDXContent
}
