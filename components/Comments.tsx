
"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function CommentsSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!postId) return;

        // Subcollection ref: posts/{postId}/comments
        const q = query(
            collection(db, "posts", postId, "comments"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !authorName.trim()) return;
        setSubmitting(true);

        try {
            await addDoc(collection(db, "posts", postId, "comments"), {
                content: newComment,
                author: authorName,
                createdAt: serverTimestamp(),
            });
            setNewComment("");
            // Provide user feedback if needed
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 max-w-2xl mx-auto px-4 sm:px-0">
            <h3 className="text-2xl font-black text-foreground mb-8 border-b border-border pb-4 uppercase italic">
                Yorumlar ({comments.length})
            </h3>

            <form onSubmit={handleSubmit} className="mb-12 space-y-6 bg-muted/30 p-8 rounded-[2rem] border border-border shadow-sm">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">İSİM SOYİSİM</label>
                    <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl h-12 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        placeholder="Adınız..."
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">MESAJINIZ</label>
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Düşüncelerini paylaş..."
                        className="bg-background border-border min-h-[120px] rounded-2xl p-4 focus-visible:ring-primary/50 text-foreground"
                        required
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={submitting} className="bg-primary hover:opacity-90 text-primary-foreground font-black uppercase tracking-widest px-8 h-12 rounded-xl transition-all">
                        {submitting ? "GÖNDERİLİYOR..." : "YORUM YAP"}
                    </Button>
                </div>
            </form>

            <div className="space-y-6 pb-20">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-6 p-6 rounded-[2rem] bg-muted/10 border border-border/50 hover:bg-muted/20 transition-all">
                        <Avatar className="w-12 h-12 border border-border shadow-sm">
                            <AvatarFallback className="bg-primary text-primary-foreground font-black uppercase">
                                {comment.author.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-foreground tracking-tight">{comment.author}</h4>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true, locale: tr }) : "Şimdi"}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed font-medium italic">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-[2rem]">
                        <p className="text-muted-foreground font-medium italic">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
