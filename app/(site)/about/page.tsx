
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-12 mt-10">

            <div className="flex flex-col items-center space-y-6 text-center">
                <Avatar className="w-40 h-40 border-4 border-background shadow-2xl">
                    <AvatarImage src="https://github.com/basaransemih.png" />
                    <AvatarFallback>SB</AvatarFallback>
                </Avatar>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Semih BAŞARAN</h1>
                    <p className="text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
                        Yazılım geliştirme, açık kaynak projeler ve teknoloji üzerine çalışan bir geliştirici.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <SocialLink href="https://github.com/basaransemih" icon={Github} />
                    <SocialLink href="https://twitter.com" icon={Twitter} />
                    <SocialLink href="https://linkedin.com" icon={Linkedin} />
                    <SocialLink href="mailto:iletisim@semihbasaran.com" icon={Mail} />
                </div>
            </div>

            <div className="prose prose-invert prose-lg mx-auto prose-p:text-zinc-400">
                <h2 className="text-zinc-200 font-bold border-b border-zinc-800 pb-2 mb-4">Hakkımda</h2>
                <p>
                    Merhaba! Ben Semih. Teknolojiyi ve kod yazmayı seven biriyim. Bu blogda öğrendiklerimi, tecrübelerimi ve projelerimi paylaşıyorum.
                </p>
                <p>
                    Modern web teknolojileri, özellikle Next.js, React ve Cloud sistemleri üzerine çalışıyorum. Açık kaynak dünyasına katkıda bulunmaktan ve yeni şeyler öğrenmekten keyif alıyorum.
                </p>
            </div>

        </div>
    );
}

function SocialLink({ href, icon: Icon }: any) {
    return (
        <Link
            href={href}
            target="_blank"
            className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 transition-all duration-300"
        >
            <Icon className="w-5 h-5" />
        </Link>
    )
}
