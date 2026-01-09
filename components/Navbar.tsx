"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Monitor, Search, Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { useSettings } from "./SettingsProvider";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<any>(null);
    const { settings } = useSettings();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
        }
    };

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="glass h-20 rounded-[2rem] px-8 flex items-center justify-between relative overflow-hidden group/nav">
                <div className="flex items-center gap-8 relative z-10">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-foreground uppercase italic leading-none hover:scale-105 transition-transform shrink-0">
                        {settings.siteTitle || "Semih BAŞARAN"}
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-1 border-l border-border pl-8 ml-2">
                        <NavLink href="/" active={pathname === "/"}>Ana Sayfa</NavLink>
                        <NavLink href="/about/" active={pathname === "/about"}>Hakkımda</NavLink>
                        <NavLink href="/contact/" active={pathname === "/contact"}>İletişim</NavLink>
                    </nav>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <div className={cn(
                        "flex items-center bg-muted/50 rounded-2xl border border-border pr-2 transition-all duration-500 overflow-hidden",
                        showSearch ? "w-64 opacity-100" : "w-0 opacity-0 border-transparent"
                    )}>
                        <form onSubmit={handleSearch} className="w-full">
                            <input
                                autoFocus
                                placeholder="Arama yap..."
                                className="h-10 w-full bg-transparent border-none outline-none px-4 text-xs font-bold text-foreground uppercase tracking-widest placeholder:text-muted-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
                            />
                        </form>
                    </div>

                    <div className="flex items-center bg-muted/50 rounded-2xl p-1 gap-1 border border-border">
                        <NavButton icon={Search} onClick={() => setShowSearch(!showSearch)} active={showSearch} />
                        <ThemeToggle />
                        {user && (
                            <Link href="/admin">
                                <NavButton icon={Monitor} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-foreground",
                active ? "text-foreground bg-foreground/5 shadow-lg shadow-black/5" : "text-muted-foreground"
            )}
        >
            {children}
        </Link>
    );
}

function NavButton({ icon: Icon, onClick, active }: { icon: any; onClick?: () => void; active?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}
