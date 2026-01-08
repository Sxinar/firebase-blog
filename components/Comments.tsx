
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
        <div className="mt-16 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">
                Yorumlar ({comments.length})
            </h3>

            <form onSubmit={handleSubmit} className="mb-12 space-y-4 bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/50">
                <div>
                    <label className="text-sm text-zinc-400 mb-1 block">İsim</label>
                    <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-700 rounded-md p-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Adınız..."
                        required
                    />
                </div>
                <div>
                    <label className="text-sm text-zinc-400 mb-1 block">Yorum</label>
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Düşüncelerini paylaş..."
                        className="bg-zinc-950/50 border-zinc-700 min-h-[100px] focus-visible:ring-indigo-500"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {submitting ? "Gönderiliyor..." : "Yorum Yap"}
                    </Button>
                </div>
            </form>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/30">
                        <Avatar className="w-10 h-10 border border-zinc-700">
                            <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold uppercase">
                                {comment.author.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-zinc-200">{comment.author}</h4>
                                <span className="text-xs text-zinc-500">
                                    {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true, locale: tr }) : "Şimdi"}
                                </span>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-zinc-600 italic">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                )}
            </div>
        </div>
    );
}
