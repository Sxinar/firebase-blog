
import { Navbar } from "@/components/Navbar";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-12 container mx-auto px-4 max-w-3xl">{children}</main>
        </div>
    );
}
