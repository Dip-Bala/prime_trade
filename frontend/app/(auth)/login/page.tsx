"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { BaseSchema } from "../register/page";
import Link from "next/link";
import ErrorAlert from "@/components/ErrorAlert";
import { useState } from "react";

const LoginSchema = BaseSchema.pick({
  email: true,
  password: true,
});

export type LoginValuesType = z.infer<typeof LoginSchema>;

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValuesType>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (data: LoginValuesType) => api.post("/auth/login", data),
    onSuccess: (res) => {
      // console.log(res.data.message)
      queryClient.setQueryData(["me"], res.data.user);
      window.location.href = "/dashboard";
    },
    onError: (err: any) => {
    const message =
      err?.response?.data?.message || "Something went wrong. Please try again.";
    setError(message);
  },
  });

  const onSubmit: SubmitHandler<LoginValuesType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
     {error && (
  <ErrorAlert
    message={error}
    onClose={() => setError(null)}
  />
)}

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-sm rounded-2xl shadow-md px-6 py-8 bg-linear-to-b from-primary to-background to-10%"
    >
      <div className="flex items-center gap-2 text-foreground font-medium text-lg">
        <LogIn />
        <span>Login</span>
      </div>

      <div className="flex flex-col gap-1">
        <label>Email</label>
        <input
          {...register("email")}
          className="border rounded-md px-3 py-2 border-zinc-400 focus:outline-primary "
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>


      <div className="flex flex-col gap-1">
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
          className="border rounded-md px-3 py-2 border-zinc-400 focus:outline-primary "
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || mutation.isPending}
        className={`rounded-md px-4 py-2 transition-all
          ${
            isValid
              ? "bg-foreground text-background cursor-pointer"
              : "bg-primary text-background cursor-not-allowed"
          }
        `}
      >
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm text-center mt-2">
        Don’t have an account?{" "}
        <Link href="/register" className="text-foreground font-medium hover:underline cursor-pointer">
          Register
        </Link>
      </p>
    </form>
    </>
  );
}
