
export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    createdAt: any;
    updatedAt?: any;
    commentStatus?: 'open' | 'closed';
}

export interface Settings {
    siteTitle: string;
    siteDescription: string;
    primaryColor: string;
    maintenanceMode: boolean;
    logoUrl?: string;
}

export interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: any;
    isRead: boolean;
}

export interface Comment {
    id: string;
    postId: string;
    author: string;
    content: string;
    createdAt: any;
    approved: boolean;
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: any;
}
