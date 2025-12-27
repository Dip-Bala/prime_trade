"use client"
import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex justify-center">
            <div className="flex flex-col py-20">
                {children}
            </div>
        </div>
    );
}
