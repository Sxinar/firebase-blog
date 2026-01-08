
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 space-y-20">
            {/* Header Section */}
            <header className="flex flex-col items-center text-center space-y-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                    <Avatar className="w-44 h-44 border-8 border-background shadow-2xl relative">
                        <AvatarImage src="https://github.com/basaransemih.png" className="object-cover" />
                        <AvatarFallback className="text-3xl font-black">SB</AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.8] lg:leading-[0.85]">
                        Semih BAŞARAN
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-500 font-medium tracking-tight max-w-2xl mx-auto italic">
                        "Teknoloji, sanat ve insan arasındaki bağı kodlayarak keşfeden bir geliştirici."
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <SocialLink href="https://github.com/basaransemih" icon={Github} label="GitHub" />
                    <SocialLink href="https://twitter.com" icon={Twitter} label="Twitter" />
                    <SocialLink href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
                    <SocialLink href="mailto:iletisim@semihbasaran.com" icon={Mail} label="Email" />
                </div>
            </header>

            {/* Content Section */}
            <div className="glass rounded-[3rem] p-8 md:p-16 space-y-12">
                <div className="prose prose-invert prose-xl max-w-none 
                    prose-p:text-zinc-400 prose-p:leading-relaxed
                    prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                    prose-strong:text-white prose-strong:font-black
                    prose-blockquote:border-l-rose-500 prose-blockquote:bg-rose-500/5 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl">

                    <h2 className="text-zinc-200 mt-0">Hikaye</h2>
                    <p>
                        Küçük yaşlarda başlayan teknoloji merakım, bugün modern web dünyasının karmaşık yapılarını inşa etme tutkusuna dönüştü. Özellikle <strong>Open Source</strong> topluluklarına katkı sağlamak ve insanların hayatını kolaylaştıracak dijital araçlar üretmek benim için bir yaşam biçimi.
                    </p>

                    <h2 className="text-zinc-200">Neler Yapıyorum?</h2>
                    <p>
                        Daha çok <strong>Next.js</strong>, <strong>React</strong> ve <strong>Firebase</strong> ekosisteminde uzmanlaşmış durumdayım. UI/UX tasarımına önem veriyor, estetik ve fonksiyonelliği bir araya getiren "premium" kullanıcı deneyimleri yaratmaya odaklanıyorum.
                    </p>

                    <p className="italic text-rose-500/80 font-medium">
                        Bu blog benim dijital bahçem. Burada sadece kod değil, hayatımın içinden geçen mimari notları da paylaşıyorum.
                    </p>
                </div>
            </div>
        </div>
    );
}

function SocialLink({ href, icon: Icon, label }: any) {
    return (
        <Link
            href={href}
            target="_blank"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:scale-105 transition-all duration-300"
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
        </Link>
    )
}
