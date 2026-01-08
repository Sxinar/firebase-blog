
import Link from "next/link";
import { Monitor, Search } from "lucide-react";

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm">
            <nav className="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                <Link href="#" className="hover:text-primary transition-colors">Blog</Link>
                <Link href="#" className="hover:text-primary transition-colors">Hakkımda</Link>
            </nav>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Semih BAŞARAN</h1>
            </div>

            <div className="flex items-center space-x-4 text-muted-foreground">
                <button className="hover:text-primary transition-colors">
                    <Monitor className="w-5 h-5" />
                </button>
                <button className="hover:text-primary transition-colors">
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
