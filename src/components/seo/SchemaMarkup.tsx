import { Organization, LocalBusiness, Course, FAQPage, WithContext } from 'schema-dts'

interface SchemaMarkupProps {
  schema:
    | WithContext<Organization | LocalBusiness | Course | FAQPage>
    | WithContext<Organization | LocalBusiness | Course | FAQPage>[]
}

/**
 * Composant pour injecter les Schema Markup JSON-LD dans le DOM
 * Utilise un script tag simple au lieu de next/script pour éviter les conflits
 * Compatible avec Next.js App Router
 */
export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s),
          }}
        />
      ))}
    </>
  )
}
