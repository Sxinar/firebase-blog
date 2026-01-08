
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Monitor, Search, Github } from "lucide-react";

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-white/5">
            <nav className="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                <Link
                    href="/"
                    className={cn("hover:text-primary transition-colors", pathname === "/" && "text-foreground font-bold")}
                >
                    Ana Sayfa
                </Link>
                <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                >
                    Blog
                </Link>
                <Link
                    href="/about"
                    className={cn("hover:text-primary transition-colors", pathname === "/about" && "text-foreground font-bold")}
                >
                    Hakkımda
                </Link>
            </nav>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
                    Semih BAŞARAN
                </Link>
            </div>

            <div className="flex items-center space-x-4 text-muted-foreground">
                <Link href="/admin" target="_blank" className="hover:text-primary transition-colors">
                    <Monitor className="w-5 h-5" />
                </Link>
                <button
                    className="hover:text-primary transition-colors"
                    onClick={() => alert("Arama özelliği yakında eklenecek!")}
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
