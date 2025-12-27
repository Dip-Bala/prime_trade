"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { useState } from "react";
import { Plus } from "lucide-react";
import AddTaskModal, { TaskFormValues } from "@/components/AddTaskModal";

type Task = TaskFormValues & {
  _id: string;
};

export default function DashboardPage() {
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data.tasks;
    },
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "DONE").length;
  const pendingTasks = tasks.filter(t => t.status === "PENDING").length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <button
          onClick={() => setOpenAddTaskModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Tasks" value={totalTasks} />
        <SummaryCard title="Completed" value={completedTasks} />
        <SummaryCard title="Pending" value={pendingTasks} />
      </div>

      {/* TASK LIST */}
      {isLoading && <p>Loading tasks...</p>}
      {isError && <p>Failed to load tasks.</p>}

      {!isLoading && tasks.length === 0 && (
        <p className="text-muted-foreground">No tasks found.</p>
      )}

      <div className="grid gap-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border rounded-md p-4 bg-background shadow-sm"
          >
            <h3 className="font-medium">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
            <span
              className={`text-xs mt-1 inline-block font-medium ${
                task.status === "DONE"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {task.status}
            </span>
          </div>
        ))}
      </div>

      {/* ADD TASK MODAL */}
      {openAddTaskModal && (
        <AddTaskModal onClose={() => setOpenAddTaskModal(false)} />
      )}
    </div>
  );
}

/* ----------------- SUMMARY CARD ----------------- */

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
