"use client";

import { useState } from "react";

type TaskStatus = "PENDING" | "WORKING ON" | "DONE";

type Props = {
  task?: {
    _id?: string;
    title: string;
    description?: string;
    status: TaskStatus;
  };
  isEditing?: boolean;
  onSave: (data: {
    title: string;
    description?: string;
    status: TaskStatus;
  }) => void;
  onCancel: () => void;
};

export default function TaskCard({
  task,
  isEditing = false,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(
    task?.status || "PENDING"
  );

  return (
    <div className="border border-secondary rounded-lg p-4 space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full shadow-sm bg-white px-3 py-2 rounded-md"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full shadow-sm bg-white px-3 py-2 rounded-md"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        className="w-full shadow-sm bg-white px-3 py-2 rounded-md"
      >
        <option value="PENDING">Pending</option>
        <option value="WORKING ON">Working On</option>
        <option value="DONE">Done</option>
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="border px-3 py-1 rounded-md cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={() => onSave({ title, description, status })}
          className="bg-foreground text-background px-4 py-1 rounded-md cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}
