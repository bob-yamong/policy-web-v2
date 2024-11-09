import React from 'react';

const Table = ({ data, columns }) => (
  <table className="min-w-full bg-white border border-gray-300">
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th key={index} className="px-4 py-2 text-left bg-gray-100 font-semibold text-gray-800 border-b">
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((col, colIndex) => (
            <td key={colIndex} className="px-4 py-2 border-b">
              {row[col.toLowerCase()]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
