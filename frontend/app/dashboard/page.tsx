"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { useState } from "react";
import { Plus } from "lucide-react";
import AddTaskModal, { TaskFormValues } from "@/components/AddTaskModal";
import { StatusType } from "./tasks/page";
import SummaryCard from "@/components/SummaryCard";

type Task = TaskFormValues & {
  _id: string;
};

export const statusStyle: Record<StatusType, string> = {
  'PENDING': 'bg-amber-200 ',
  'WORKING ON': 'bg-blue-100 ',
  'DONE': 'bg-green-100 '
}

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
  const inProgressTasks = tasks.filter(t => t.status === "WORKING ON").length;


  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Tasks"
          value={totalTasks}
          variant="total"
        />
        <SummaryCard
          title="Pending"
          value={pendingTasks}
          variant="pending"
        />
        <SummaryCard
          title="In Progress"
          value={inProgressTasks}
          variant="progress"
        />
        <SummaryCard
          title="Completed"
          value={completedTasks}
          variant="done"
        />
      </div>


      {isLoading && <p>Loading tasks...</p>}
      {isError && <p>Failed to load tasks.</p>}

      {!isLoading && tasks.length === 0 && (
        <p className="text-muted-foreground">No tasks found.</p>
      )}

      {tasks.map((task) =>
      (
        <div
          key={task._id}
          className="shadow-md bg-white rounded-lg p-4 flex justify-between items-center gap-4"
        >
          <div className="flex gap-2 justify-between flex-11 items-center text-lg">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className=" text-gray-500 text-md">{task.description}</p>
            </div>
            <span className={`${statusStyle[task.status]} px-4 py-1 rounded-full text-sm font-medium text-secondary`}>
              {task.status}
            </span>
          </div>
        </div>
      )
      )}

      {openAddTaskModal && (
        <AddTaskModal onClose={() => setOpenAddTaskModal(false)} />
      )}
    </div>
  );
}


