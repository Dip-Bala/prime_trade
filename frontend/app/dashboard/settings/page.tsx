"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
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

  console.log("user", user)
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-xl font-semibold">Account Settings</h1>

      {/* USER INFO */}
      <div className="bg-white p-6 rounded-lg shadow space-y-3">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium">{user.role}</p>
        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => setShowLogout(true)}
        className="text-red-600 font-medium"
      >
        Logout
      </button>

      {/* LOGOUT MODAL */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6  space-y-4">
            <h3 className="font-semibold text-lg">Logout?</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded"
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
