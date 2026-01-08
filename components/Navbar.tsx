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

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<any>(null);
    const [settings, setSettings] = useState({ siteTitle: "Semih BAŞARAN" });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "site");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as any);
                }
            } catch (error) { }
        };
        fetchSettings();

        return () => unsubscribe();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
            <nav className="flex items-center space-x-6 text-sm font-medium text-muted-foreground hidden md:flex">
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
                <Link
                    href="/contact"
                    className={cn("hover:text-primary transition-colors", pathname === "/contact" && "text-foreground font-bold")}
                >
                    İletişim
                </Link>
            </nav>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity whitespace-nowrap">
                    {settings.siteTitle}
                </Link>
            </div>

            <div className="flex items-center space-x-2 text-muted-foreground">

                {showSearch ? (
                    <form onSubmit={handleSearch} className="mr-2">
                        <Input
                            autoFocus
                            placeholder="Ara..."
                            className="h-8 w-48 bg-background border-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => !searchQuery && setShowSearch(false)}
                        />
                    </form>
                ) : (
                    <button
                        className="hover:text-primary transition-colors p-2"
                        onClick={() => setShowSearch(true)}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                )}

                {user && (
                    <Link href="/admin" target="_blank" className="hover:text-primary transition-colors p-2 hidden sm:block">
                        <Monitor className="w-5 h-5" />
                    </Link>
                )}

                <ThemeToggle />
            </div>
        </header>
    );
}
