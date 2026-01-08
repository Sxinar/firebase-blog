
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Post, Settings, Message, Page } from "@/types";

// --- SETTINGS ---
export const getSettings = async (): Promise<Settings> => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Settings;
    }
    // Default settings
    return {
        siteTitle: "Dawn Blog",
        siteDescription: "Minimalist & Modern Blog",
        primaryColor: "#6366f1",
        maintenanceMode: false
    };
};

export const updateSettings = async (settings: Partial<Settings>) => {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
};

// --- POSTS ---
export const getPosts = async (pageSize = 10, lastVisible?: any) => {
    let q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(pageSize));
    if (lastVisible) {
        q = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(pageSize));
    }
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
    return { posts, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Post;
};

// --- MESSAGES (CONTACT) ---
export const sendMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => {
    await addDoc(collection(db, "messages"), {
        ...message,
        createdAt: serverTimestamp(),
        isRead: false
    });
};

export const getMessages = async () => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
};

export const deleteMessage = async (id: string) => {
    await deleteDoc(doc(db, "messages", id));
};

// --- PAGES ---
export const getPages = async () => {
    const querySnapshot = await getDocs(collection(db, "pages"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Page[];
};

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
    const q = query(collection(db, "pages"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Page;
};
