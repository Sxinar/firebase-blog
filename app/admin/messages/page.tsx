
"use client";

import { useEffect, useState } from "react";
import { getMessages, deleteMessage } from "@/lib/db";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, User, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function InboxPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        const data = await getMessages();
        setMessages(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
        await deleteMessage(id);
        setMessages(messages.filter(m => m.id !== id));
    };

    if (loading) return <div className="text-white">Yükleniyor...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white">Gelen Kutusu</h1>
                <p className="text-zinc-500 mt-2">İletişim formundan gelen mesajlar burada listelenir.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {messages.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[2.5rem]">
                        <Mail className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 font-medium">Henüz hiç mesajınız yok.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-8 hover:bg-zinc-900/50 transition-all group relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div className="space-y-4 flex-1">
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800/50">
                                            <User className="w-4 h-4 text-indigo-400" />
                                            <span className="text-sm font-bold text-zinc-300">{msg.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800/50">
                                            <Mail className="w-4 h-4 text-rose-400" />
                                            <span className="text-sm font-bold text-zinc-300">{msg.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2 rounded-full border border-zinc-800/50">
                                            <Calendar className="w-4 h-4 text-amber-400" />
                                            <span className="text-sm font-bold text-zinc-300">
                                                {msg.createdAt ? format(new Date(msg.createdAt.seconds * 1000), "d MMMM yyyy HH:mm", { locale: tr }) : "-"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-white italic flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-zinc-500" />
                                            {msg.subject || "Konu Yok"}
                                        </h3>
                                        <p className="text-zinc-400 leading-relaxed font-medium">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(msg.id)}
                                    className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all self-start md:self-center shadow-xl shadow-red-500/5"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
