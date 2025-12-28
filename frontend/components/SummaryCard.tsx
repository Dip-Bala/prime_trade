import { CheckCircle, Clock, ListTodo, Loader } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: number;
  variant: "total" | "pending" | "progress" | "done";
};

const variants = {
  total: {
    icon: <ListTodo size={22} />,
    bg: "bg-foreground/90",
    text: "text-background",
  },
  pending: {
    icon: <Clock size={22} />,
    bg: "bg-amber-200",
    text: "text-white-700",
  },
  progress: {
    icon: <Loader size={22} />,
    bg: "bg-blue-100",
    text: "text-secondary",
  },
  done: {
    icon: <CheckCircle size={22} />,
    bg: "bg-green-100",
    text: "text-secondary",
  },
};

export default function SummaryCard({
  title,
  value,
  variant,
}: SummaryCardProps) {
  const style = variants[variant];

  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 shadow-sm ${style.bg} ${style.text}`}
    >
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>

      <div className={`${style.text}`}>{style.icon}</div>
    </div>
  );
}
