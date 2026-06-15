export const SkeletonRow = ({ cols = 5 }: { cols?: number }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div
          className="h-4 rounded shimmer-bg"
          style={{ width: `${60 + Math.random() * 30}%` }}
        />
      </td>
    ))}
  </tr>
);

export const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="h-4 w-1/3 rounded shimmer-bg" />
    <div className="h-8 w-1/2 rounded shimmer-bg" />
    <div className="h-3 w-2/3 rounded shimmer-bg" />
  </div>
);
