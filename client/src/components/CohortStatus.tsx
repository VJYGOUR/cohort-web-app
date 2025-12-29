type Props = {
  status: string;
};

const statusColor: Record<string, string> = {
  draft: "bg-gray-300",
  enrollment_open: "bg-green-500 text-white",
  enrollment_closed: "bg-yellow-500 text-white",
  active: "bg-blue-500 text-white",
  completed: "bg-gray-700 text-white",
};

export default function CohortStatus({ status }: Props) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded ${
        statusColor[status] ?? "bg-gray-200"
      }`}
    >
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}
