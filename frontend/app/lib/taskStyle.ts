export type TaskStatus = "PENDING" | "WORKING ON" | "DONE";

export const statusStyles: Record<
  TaskStatus,
  { bg: string; text: string }
> = {
  PENDING: {
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  "WORKING ON": {
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  DONE: {
    bg: "bg-green-100",
    text: "text-green-700",
  },
};
