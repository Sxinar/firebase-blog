"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login"); // Changed from /admin/login to /login per my new page
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">Yükleniyor...</div>;

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-rose-500/30">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-12 relative min-h-screen">
                {/* Background glow effects */}
                <div className="absolute -top-20 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
