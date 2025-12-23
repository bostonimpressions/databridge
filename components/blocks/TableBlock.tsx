// components/blocks/TableBlock.tsx
import { PortableText } from '@portabletext/react';

export default function TableBlock({ value }) {
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
