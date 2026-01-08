
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-12 mt-10">

            <div className="flex flex-col items-center space-y-4 text-center">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                    {/* Using a placeholder or the actual image if I could */}
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>SB</AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">basaransemih</h1>
                    <p className="text-muted-foreground text-lg">Semih BAŞARAN ve yazıları</p>
                </div>

                <Link href="https://github.com/basaransemih" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors p-2">
                    <Github className="w-6 h-6" />
                </Link>
            </div>

            <div className="w-full max-w-lg space-y-8">

                <Link href="#" className="group flex items-start gap-6">
                    <div className="flex flex-col items-end text-xs font-bold text-red-500 uppercase min-w-[3rem] pt-1">
                        <span>ARA</span>
                        <span className="text-xl leading-none">26</span>
                    </div>
                    <div className="text-lg text-zinc-300 group-hover:text-red-500 transition-colors font-medium">tttt</div>
                </Link>

                <Link href="#" className="group flex items-start gap-6">
                    <div className="flex flex-col items-end text-xs font-bold text-red-500 uppercase min-w-[3rem] pt-1">
                        <span>ARA</span>
                        <span className="text-xl leading-none">21</span>
                    </div>
                    <div className="text-lg text-zinc-300 group-hover:text-red-500 transition-colors font-medium">nabersiniz gençler</div>
                </Link>

                <Link href="#" className="group flex items-start gap-6">
                    <div className="flex flex-col items-end text-xs font-bold text-red-500 uppercase min-w-[3rem] pt-1">
                        <span>ARA</span>
                        <span className="text-xl leading-none">19</span>
                    </div>
                    <div className="text-lg text-zinc-300 group-hover:text-red-500 transition-colors font-medium">yeni yazim</div>
                </Link>

            </div>
        </div>
    );
}
