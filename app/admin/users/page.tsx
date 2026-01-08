"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, ShieldCheck, Mail, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface AdminUser {
    id: string;
    email: string;
    displayName: string;
    role: string;
    lastLogin?: any;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const usersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as AdminUser[];
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/login");
    };

    if (loading) return <div className="text-white">Giriş yetkileri yükleniyor...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Yöneticiler</h1>
                    <p className="text-zinc-400">Panel erişimi olan tüm kullanıcıları görün.</p>
                </div>
                <Button variant="destructive" onClick={handleSignOut} className="gap-2">
                    <LogOut className="w-4 h-4" /> Çıkış Yap
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Current User Card */}
                {currentUser && (
                    <Card className="bg-indigo-600/10 border-indigo-500/20 text-zinc-100 ring-1 ring-indigo-500/30">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <Avatar className="w-16 h-16 border-2 border-indigo-500/30">
                                <AvatarFallback className="bg-indigo-500 text-white font-bold">{currentUser.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">Siz (Mevcut Oturum)</CardTitle>
                                <CardDescription className="text-indigo-300/70">{currentUser.email}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-medium italic">Süper Admin</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {users.filter(u => u.email !== currentUser?.email).map((user) => (
                    <Card key={user.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <Avatar className="w-16 h-16">
                                <AvatarFallback className="bg-zinc-800 text-zinc-400">{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">{user.displayName || "Admin"}</CardTitle>
                                <CardDescription className="text-zinc-500">{user.email}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-zinc-700">Yönetici</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                    <User className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-zinc-300">Yeni Yönetici Ekle</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto text-sm">Yeni birini yönetici yapmak için Firebase Console üzerinden Authentication sekmesini kullanın.</p>
                </div>
            </div>
        </div>
    );
}
