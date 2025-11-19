import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface Card {
  heading: string;
  body: string;
}

interface TableRow {
  values: string[];
}

interface Table {
  headers: string[];
  rows: TableRow[];
}

interface Props {
  heading: PortableTextBlock[];
  body: PortableTextBlock[];
  cards?: Card[];
  table?: Table;
}

export default function FeatureSection({ heading, body, cards = [], table }: Props) {
  return (
    <section className="relative overflow-hidden py-[20] pb-[40] md:py-[60]">
      <div className="container">
        <div className="block-stats">
          {cards.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card, i) => (
                <div key={i} className="rounded-xl bg-blue-600 p-4 text-white">
                  <h3 className="font-share-tech font-semibold">{card.heading}</h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2>
              <PortableText
                value={heading}
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
          <div className="md:col-span-2">
            {table && table.headers.length > 0 && (
              <div className="mt-8 overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      {table.headers.map((header, i) => (
                        <th key={i} className="border p-2 text-left font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={i} className="even:bg-gray-50">
                        {row.values.map((val, j) => (
                          <td key={j} className="border p-2">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
