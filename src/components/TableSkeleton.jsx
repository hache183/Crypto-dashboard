export default function TableSkeleton({ rows = 10 }) {
  return (
    <div className="animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="py-3 px-4">
                <div className="h-4 bg-gray-800 rounded w-20 mx-auto"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-800">
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-800 rounded w-8"></div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-800 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-800 rounded w-16"></div>
                  </div>
                </div>
              </td>
              {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="py-3 px-4">
                  <div className="h-4 bg-gray-800 rounded w-16 mx-auto"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}