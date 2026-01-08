"use client";

import { useEffect, useState } from "react";
import { collectionGroup, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, User, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: any;
    postId: string;
    path: string; // To know where to delete
}

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const q = query(collectionGroup(db, "comments"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const commentsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                path: doc.ref.path,
            })) as Comment[];
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = async (path: string) => {
        if (confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
            try {
                await deleteDoc(doc(db, path));
                setComments(comments.filter(c => c.path !== path));
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert("Yorum silinirken bir hata oluştu.");
            }
        }
    };

    if (loading) return <div className="text-white">Yorumlar yükleniyor...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Yorum Yönetimi</h1>
                <p className="text-zinc-400">Tüm yazılara gelen yorumları buradan yönetebilirsiniz.</p>
            </div>

            <div className="grid gap-4">
                {comments.length === 0 ? (
                    <p className="text-zinc-500 text-center py-12 bg-zinc-900/30 rounded-3xl border border-zinc-800/50">
                        Henüz yorum yapılmamış.
                    </p>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.path} className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                                            <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                                                <User className="w-4 h-4" />
                                                {comment.author}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: tr }) : ""}
                                            </div>
                                        </div>
                                        <p className="text-zinc-300 leading-relaxed bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                                            {comment.content}
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(comment.path)}
                                        className="shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
