import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

interface Feature {
  title: PortableTextBlock[]
  description: PortableTextBlock[]
}

interface FeatureSectionProps {
  features: Feature[];
}

export default function FeatureSection({ features }: FeatureSectionProps) {
  return (
    <section className="py-20 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
      {features.map((f: Feature, i: number) => (
        <div key={i} className="p-4 border rounded shadow-sm">
          <h3 className="font-semibold text-xl mb-2">
            <PortableText value={f.title} />
          </h3>
          <div>
            <PortableText value={f.description} />
          </div>
        </div>
      ))}
    </section>
  )
}
