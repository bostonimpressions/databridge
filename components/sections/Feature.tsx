import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface Props {
  title: PortableTextBlock[];
  body: PortableTextBlock[];
}

export default function FeatureSection({ title, body }: Props) {
  return (
    <section className="relative overflow-hidden py-[20] pb-[40] md:py-[60]">
      <div className="container">
        <h2>
          <PortableText
            value={title}
            components={{
              marks: {
                highlight: ({ children }) => <span className="text-highlight">{children}</span>,
              },
            }}
          />
        </h2>
        <PortableText
          value={body}
          components={{
            marks: {
              highlight: ({ children }) => <span className="text-highlight">{children}</span>,
            },
          }}
        />
      </div>
    </section>
  );
}
