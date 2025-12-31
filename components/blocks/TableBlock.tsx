// components/blocks/TableBlock.tsx
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { portableTextComponents } from '@/lib/portableTextComponents';
import type { SectionTheme } from '@/types/sections';
import type { PortableTextComponents } from '@portabletext/react';

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
  theme?: SectionTheme;
}

export default function TableBlock({ value, theme = 'light' }: TableBlockProps) {
  // Theme-specific class configurations
  const themeClasses = {
    light: {
      headerBorder: 'border-blue-ribbon-500',
      headerText: 'text-black',
      text: 'text-black',
      rowBorder: 'border-gray-300',
      rowBg: 'bg-gray-50',
      tbodyBorder: 'border-perano-300',
      rowStyle: {},
    },
    dark: {
      headerBorder: 'border-gray-500',
      headerText: 'text-white',
      text: 'text-white',
      rowBorder: 'border-gray-400',
      rowBg: 'bg-gray-800',
      tbodyBorder: 'border-perano-300',
      rowStyle: {},
    },
    midnight: {
      headerBorder: 'border-gray-500',
      headerText: 'text-white',
      text: 'text-white',
      rowBorder: 'border-gray-400',
      rowBg: 'bg-gray-800',
      tbodyBorder: 'border-perano-300',
      rowStyle: {},
    },
    sky: {
      headerBorder: 'border-blue-600',
      headerText: 'text-sapphire-500',
      text: 'text-sapphire-500',
      rowBorder: 'border-gray-300',
      rowBg: 'bg-gray-50',
      tbodyBorder: 'border-perano-300',
      rowStyle: {},
    },
    orange: {
      headerBorder: 'border-orange-500',
      headerText: 'text-black',
      text: 'text-black',
      rowBorder: 'border-orange-100',
      rowBg: 'bg-black/5',
      tbodyBorder: 'border-orange-300',
      rowStyle: {},
    },
    gray: {
      headerBorder: 'border-sapphire-500',
      headerText: 'text-black',
      text: 'text-black',
      rowBorder: 'border-gray-300',
      rowBg: 'bg-gray-50',
      tbodyBorder: 'border-perano-300',
      rowStyle: {},
    },
  };

  // Get theme classes with fallback to light/default
  const classes = themeClasses[theme] || themeClasses.light;

  // Custom PortableText components for table cells with text-sm
  const tableTextComponents: PortableTextComponents = {
    ...portableTextComponents,
    block: {
      normal: ({ children }) => <p className="text-sm">{children}</p>,
    },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              className={`${classes.headerText} border-b-8 px-4 py-3 text-left font-semibold md:text-xl ${classes.headerBorder}`}
            >
              {value.columnA}
            </th>
            <th
              className={`${classes.headerText} border-b-8 px-4 py-3 text-left font-semibold md:text-xl ${classes.headerBorder}`}
            >
              {value.columnB}
            </th>
          </tr>
        </thead>
        <tbody className={`border-b-8 ${classes.tbodyBorder}`}>
          {value.rows.map((row, i) => (
            <tr key={i} className={`border-b-2 ${classes.rowBorder}`}>
              <td
                className={`${classes.rowBg} ${classes.text} px-4 py-5 align-top font-semibold`}
                style={classes.rowStyle}
              >
                <PortableText value={row.a} components={tableTextComponents} />
              </td>
              <td
                className={`${classes.rowBg} ${classes.text} px-4 py-5 align-top`}
                style={classes.rowStyle}
              >
                <PortableText value={row.b} components={tableTextComponents} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
