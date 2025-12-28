"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { statusStyle } from "../page";

export type StatusType = "PENDING" | "WORKING ON" | "DONE";
type Task = {
  _id: string;
  title: string;
  description?: string;
  status: StatusType;
};

export default function TasksPage() {
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data.tasks;
    },
  });

  const createTask = useMutation({
    mutationFn: (data: Partial<Task>) => api.post("/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreating(false);
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingId(null);
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ">
        <h1 className="text-xl font-semibold">Tasks</h1>

        <button
          onClick={() => setIsCreating(true)}
          className="bg-foreground text-background px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18}/>
           Add Task
        </button>
      </div>

      {isCreating && (
        <TaskCard
          onSave={(data) => createTask.mutate(data)}
          onCancel={() => setIsCreating(false)}
        />
      )}


      {tasks.map((task) =>
        editingId === task._id ? (
          <TaskCard
            key={task._id}
            task={task}
            onSave={(data) =>
              updateTask.mutate({ id: task._id, data })
            }
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={task._id}
            className="shadow-md bg-white rounded-lg p-4 flex justify-between items-center gap-4"
          >
            <div className="flex gap-4 justify-between flex-11 items-center">
              <div className="">
              <h3 className="font-medium text-lg">{task.title}</h3>
              <p className=" text-gray-500 text-md">{task.description}</p>
              </div>
              <span className={`${statusStyle[task.status]} px-4 py-1 rounded-full text-sm font-medium`}>
                {task.status}
              </span>
            </div>

            <div className="flex gap-4 flex-1  ">
              <button
                onClick={() => setEditingId(task._id)}
                className="text-primary cursor-pointer"
              >
                <Pencil />
              </button>
              <button
                onClick={() => deleteTask.mutate(task._id)}
                className="text-accent cursor-pointer"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
