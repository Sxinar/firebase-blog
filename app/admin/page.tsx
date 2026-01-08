
import { FileText, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Panel Özeti</h1>
                <p className="text-zinc-400 text-lg">Hoş geldiniz! Blogunuzun son durumu ve istatistikleri burada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatsCard
                    title="TOPLAM YAZI"
                    value="3"
                    icon={FileText}
                    iconRootClass="bg-indigo-600 shadow-indigo-500/30"
                />
                <StatsCard
                    title="YORUMLAR"
                    value="2"
                    icon={MessageSquare}
                    iconRootClass="bg-rose-500 shadow-rose-500/30"
                />
                <StatsCard
                    title="SAYFALAR"
                    value="1"
                    icon={Eye}
                    iconRootClass="bg-amber-500 shadow-amber-500/30"
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-zinc-200">Hızlı İşlemler</h2>
                <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 flex flex-wrap items-center gap-6">
                    <Button asChild className="bg-[#18181b] hover:bg-[#27272a] text-indigo-400 font-semibold border border-white/5 h-auto py-4 px-8 text-base rounded-2xl shadow-xl shadow-black/20">
                        <Link href="/admin/add-post">Yeni Yazı</Link>
                    </Button>
                    <Button asChild className="bg-[#18181b] hover:bg-[#27272a] text-zinc-300 font-semibold border border-white/5 h-auto py-4 px-8 text-base rounded-2xl shadow-xl shadow-black/20">
                        <Link href="/admin/settings">Ayarlar</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, iconRootClass }: any) {
    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900/30 border border-zinc-800/50 p-8 hover:bg-zinc-900/50 transition-all duration-300 group">
            <div className="flex items-center gap-6">
                <div className={`p-5 rounded-2xl text-white shadow-lg ${iconRootClass} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-zinc-500 tracking-[0.15em] uppercase mb-2">{title}</p>
                    <h3 className="text-4xl font-black text-white">{value}</h3>
                </div>
            </div>
        </div>
    )
}
