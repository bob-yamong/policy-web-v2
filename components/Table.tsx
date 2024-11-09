import React from "react";

interface TableProps {
  data: any[];
  columns: string[];
}

export const Table: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} className="border px-4 py-2 bg-gray-100 text-left">{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="even:bg-gray-50">
            {columns.map((column) => (
              <td key={column} className="border px-4 py-2">
                {row[column.toLowerCase()] || "N/A"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
