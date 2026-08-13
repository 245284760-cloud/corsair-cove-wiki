import { serializeJsonLd } from '@/lib/structured-data'

export function StructuredData({ value }: Readonly<{ value: unknown }>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(value) }}
    />
  )
}
