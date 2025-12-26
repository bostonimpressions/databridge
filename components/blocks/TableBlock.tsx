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
  theme?: 'light' | 'dark' | 'midnight';
}

export default function TableBlock({ value, theme = 'light' }: TableBlockProps) {
  // Theme-based styling
  const isDark = theme === 'dark' || theme === 'midnight';
  const borderColor = isDark ? 'border-gray-400' : 'border-gray-300';
  const headerBg = isDark ? 'bg-gray-700' : 'bg-white';
  const cellBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-sapphire-500';
  const headerTextColor = isDark ? 'text-white' : 'text-sapphire-500';

  return (
    <div className="overflow-x-auto my-6">
      <table className={`w-full border-collapse border ${borderColor}`}>
        <thead>
          <tr>
            <th className={`border ${borderColor} ${headerBg} ${headerTextColor} px-4 py-3 text-left font-semibold`}>
              {value.columnA}
            </th>
            <th className={`border ${borderColor} ${headerBg} ${headerTextColor} px-4 py-3 text-left font-semibold`}>
              {value.columnB}
            </th>
          </tr>
        </thead>
        <tbody>
          {value.rows.map((row, i) => (
            <tr key={i}>
              <td className={`border ${borderColor} ${cellBg} ${textColor} px-4 py-3`}>
                <PortableText value={row.a} />
              </td>
              <td className={`border ${borderColor} ${cellBg} ${textColor} px-4 py-3`}>
                <PortableText value={row.b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
