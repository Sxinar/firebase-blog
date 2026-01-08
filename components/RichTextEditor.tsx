"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Code,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('Görsel URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-10">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(editor.isActive("bold") && "bg-zinc-800 text-indigo-400")}
            >
                <Bold className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(editor.isActive("italic") && "bg-zinc-800 text-indigo-400")}
            >
                <Italic className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn(editor.isActive("underline") && "bg-zinc-800 text-indigo-400")}
            >
                <UnderlineIcon className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-zinc-800 mx-1 self-center" />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn(editor.isActive("heading", { level: 1 }) && "bg-zinc-800 text-indigo-400")}
            >
                <Heading1 className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(editor.isActive("heading", { level: 2 }) && "bg-zinc-800 text-indigo-400")}
            >
                <Heading2 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-zinc-800 mx-1 self-center" />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(editor.isActive("bulletList") && "bg-zinc-800 text-indigo-400")}
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(editor.isActive("orderedList") && "bg-zinc-800 text-indigo-400")}
            >
                <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(editor.isActive("blockquote") && "bg-zinc-800 text-indigo-400")}
            >
                <Quote className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-zinc-800 mx-1 self-center" />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={setLink}
                className={cn(editor.isActive("link") && "bg-zinc-800 text-indigo-400")}
            >
                <LinkIcon className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addImage}
            >
                <ImageIcon className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
            >
                <Undo className="w-4 h-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
            >
                <Redo className="w-4 h-4" />
            </Button>
        </div>
    );
};

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-400 underline decoration-indigo-400/30 underline-offset-4',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl border border-zinc-800 my-8 shadow-2xl mx-auto block max-w-full',
                },
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-lg focus:outline-none min-h-[300px] p-4 max-w-none",
            },
        },
    });

    return (
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
