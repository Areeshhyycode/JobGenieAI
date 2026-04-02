const statusConfig = {
  Applied: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  Interview: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  Offer: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  Rejected: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Applied;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
