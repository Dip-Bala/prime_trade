"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useState } from "react";
import { LogOut, User } from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [showLogout, setShowLogout] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then(res => res.data.user),
  });

  const handleLogout = async () => {
    await api.post("/auth/logout");
    queryClient.clear();
    window.location.href = "/login";
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">Settings</h1>

      <div className="border-t border-primary rounded-xl p-5 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary text-background">
            <User size={20} />
          </div>
          <h2 className="text-lg font-medium">Account Information</h2>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
        </div>
      </div>

      <div className="shadow-sm  rounded-xl p-5">
        <button
          onClick={() => setShowLogout(true)}
          className="w-full text-red-600  font-medium flex items-center gap-2 cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {showLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] space-y-4">
            <h3 className="font-semibold text-lg">Confirm Logout</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="px-4 py-2 cursor-pointer rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
