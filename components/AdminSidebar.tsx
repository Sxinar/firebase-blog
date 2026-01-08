
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, FileText, File, Link as LinkIcon, MessageSquare, Users, Settings, ExternalLink, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { name: "Panel", href: "/admin", icon: LayoutDashboard },
    { name: "Yazı Ekle", href: "/admin/add-post", icon: PlusCircle },
    { name: "Yazılar", href: "/admin/posts", icon: FileText },
    { name: "Sayfalar", href: "/admin/pages", icon: File },
    { name: "Slug Yönetimi", href: "/admin/slugs", icon: LinkIcon },
    { name: "Yorumlar", href: "/admin/comments", icon: MessageSquare },
    { name: "Kullanıcılar", href: "/admin/users", icon: Users },
    { name: "Ayarlar", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen bg-black border-r border-zinc-800 flex flex-col fixed left-0 top-0 overflow-y-auto no-scrollbar">
            <div className="p-8">
                <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">DAWN SE</h1>
                <p className="text-[10px] text-zinc-500 tracking-[0.3em] mt-1 font-semibold">YÖNETİM MERKEZİ</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-400")} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 mt-auto space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all group"
                >
                    <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                    <span className="font-medium text-sm">Siteye Git</span>
                </Link>
                <div className="px-4 py-2">
                    <button
                        className="flex w-full items-center space-x-3 text-red-700 hover:text-red-500 transition-all font-medium text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
