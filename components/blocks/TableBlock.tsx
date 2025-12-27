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
  theme?: 'light' | 'dark' | 'midnight' | 'sky' | 'orange';
}

export default function TableBlock({ value, theme = 'light' }: TableBlockProps) {
  // Theme-based styling
  const isDark = theme === 'dark' || theme === 'midnight';
  const isLight = theme === 'light';
  const isSky = theme === 'sky';
  const isOrange = theme === 'orange';
  
  // Border colors - thicker borders (2px)
  const borderColor = isDark ? 'border-gray-400' : 'border-gray-300';
  const headerBorderColor = isDark 
    ? 'border-gray-500' 
    : isSky 
    ? 'border-blue-600' 
    : isOrange 
    ? 'border-orange-600' 
    : 'border-blue-ribbon-500';
  
  // Text colors - black for light theme, white for dark/midnight, sapphire for sky/orange
  const textColor = isDark 
    ? 'text-white' 
    : isLight 
    ? 'text-black' 
    : 'text-sapphire-500';
  const headerTextColor = isDark 
    ? 'text-white' 
    : isLight 
    ? 'text-black' 
    : 'text-sapphire-500';
  
  // Row background - same for all rows, no zebra striping
  const rowBg = isDark ? 'bg-gray-800' : 'bg-gray-50';

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={`${headerTextColor} px-4 py-3 text-left text-xl font-semibold border-b-8 ${headerBorderColor}`}>
              {value.columnA}
            </th>
            <th className={`${headerTextColor} px-4 py-3 text-left text-xl font-semibold border-b-8 ${headerBorderColor}`}>
              {value.columnB}
            </th>
          </tr>
        </thead>
        <tbody className="border-b-8 border-perano-300">
          {value.rows.map((row, i) => (
            <tr key={i} className={`border-b-2 ${borderColor}`}>
              <td className={`${rowBg} ${textColor} px-4 py-5`}>
                <PortableText value={row.a} />
              </td>
              <td className={`${rowBg} ${textColor} px-4 py-5`}>
                <PortableText value={row.b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
