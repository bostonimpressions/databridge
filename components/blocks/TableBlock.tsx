// components/blocks/TableBlock.tsx
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface TableBlockValue {
  columnA: string;
  columnB: string;
  rows: Array<{
    a: PortableTextBlock[];
    b: PortableTextBlock[];
  }>;
}

interface TableBlockProps {
  value: TableBlockValue;
}

export default function TableBlock({ value }: TableBlockProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>{value.columnA}</th>
            <th>{value.columnB}</th>
          </tr>
        </thead>
        <tbody>
          {value.rows.map((row, i) => (
            <tr key={i}>
              <td>
                <PortableText value={row.a} />
              </td>
              <td>
                <PortableText value={row.b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
