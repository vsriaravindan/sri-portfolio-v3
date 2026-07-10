'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sbBrowser } from '@/lib/supabase-browser';
import {
  EditorRoot, EditorContent, EditorBubble, EditorBubbleItem,
  EditorCommand, EditorCommandList, EditorCommandItem, EditorCommandEmpty,
  JSONContent,
} from 'novel';
import { ArrowLeft, Save, Loader2, Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered } from 'lucide-react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { generateSlug } from '@/lib/posts';
import type { Editor } from '@tiptap/core';

const extensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  Placeholder.configure({ placeholder: 'Start writing...' }),
];

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [publishing, setPublishing] = useState(false);

  const handlePublish = useCallback(async (published: boolean) => {
    if (!title.trim()) return;
    setPublishing(true);
    const finalSlug = slug || generateSlug(title);
    try {
      const sb = sbBrowser;
      await (sb.from('posts' as any) as any).insert({
        title: title.trim(),
        slug: finalSlug,
        content: content ?? {},
        excerpt: excerpt.trim() || null,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        published,
        read_time: Math.max(1, Math.ceil(((content as any)?.text?.length ?? 0) / 1000)),
      });
      router.push('/blog');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  }, [title, slug, content, excerpt, tags, router]);

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-6 sm:px-10 sm:pt-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/blog" className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePublish(false)}
            disabled={publishing || !title.trim()}
            className="btn btn-ghost text-[0.65rem]"
          >
            {publishing ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Save Draft
          </button>
          <button
            onClick={() => handlePublish(true)}
            disabled={publishing || !title.trim()}
            className="btn btn-solid text-[0.65rem]"
          >
            {publishing ? <Loader2 size={12} className="animate-spin" /> : null}
            Publish
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (!slug) setSlug(generateSlug(e.target.value));
        }}
        placeholder="Post title..."
        className="w-full border-0 bg-transparent text-[length:var(--type-display-md)] font-bold leading-[var(--leading-display-md)] outline-none placeholder:text-[var(--text-muted)]"
        style={{ color: 'var(--text-primary)' }}
      />

      <div className="mt-3 flex flex-wrap gap-3">
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-url"
          className="flex-1 rounded-sm border bg-transparent px-2 py-1 font-mono text-[0.65rem] outline-none"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)', minWidth: '150px' }}
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags: devops, aws, terraform"
          className="flex-[2] rounded-sm border bg-transparent px-2 py-1 font-mono text-[0.65rem] outline-none"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)', minWidth: '200px' }}
        />
      </div>

      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Short excerpt (optional)"
        rows={2}
        className="mt-3 w-full rounded-sm border bg-transparent px-3 py-2 text-sm outline-none resize-none"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
      />

      <div className="mt-6 editor-wrap" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <EditorRoot>
          <EditorContent
            className="novel-editor"
            initialContent={content}
            extensions={extensions}
            onUpdate={({ editor }: { editor: Editor }) => {
              setContent(editor.getJSON());
            }}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-sm border bg-[var(--bg-elevated)] px-1 py-2 shadow-md"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <EditorCommandEmpty className="px-2 py-1 text-[0.7rem] text-[var(--text-muted)]">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                <EditorCommandItem
                  onCommand={({ editor, range }: { editor: Editor; range: any }) => {
                    editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
                  }}
                  className="cmd-item"
                >
                  <span className="font-bold text-sm">Heading 1</span>
                </EditorCommandItem>
                <EditorCommandItem
                  onCommand={({ editor, range }: { editor: Editor; range: any }) => {
                    editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
                  }}
                  className="cmd-item"
                >
                  <span className="font-semibold text-sm">Heading 2</span>
                </EditorCommandItem>
                <EditorCommandItem
                  onCommand={({ editor, range }: { editor: Editor; range: any }) => {
                    editor.chain().focus().deleteRange(range).toggleBulletList().run();
                  }}
                  className="cmd-item"
                >
                  <List size={14} /> Bullet List
                </EditorCommandItem>
                <EditorCommandItem
                  onCommand={({ editor, range }: { editor: Editor; range: any }) => {
                    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                  }}
                  className="cmd-item"
                >
                  <ListOrdered size={14} /> Numbered List
                </EditorCommandItem>
                <EditorCommandItem
                  onCommand={({ editor, range }: { editor: Editor; range: any }) => {
                    editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
                  }}
                  className="cmd-item"
                >
                  <Code size={14} /> Code Block
                </EditorCommandItem>
              </EditorCommandList>
            </EditorCommand>

            <EditorBubble>
              <EditorBubbleItem
                onSelect={(editor: Editor) => editor.chain().focus().toggleBold().run()}
                className="cmd-item"
              >
                <Bold size={14} />
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor: Editor) => editor.chain().focus().toggleItalic().run()}
                className="cmd-item"
              >
                <Italic size={14} />
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor: Editor) => editor.chain().focus().toggleUnderline().run()}
                className="cmd-item"
              >
                <Underline size={14} />
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor: Editor) => editor.chain().focus().toggleStrike().run()}
                className="cmd-item"
              >
                <Strikethrough size={14} />
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor: Editor) => editor.chain().focus().toggleCode().run()}
                className="cmd-item"
              >
                <Code size={14} />
              </EditorBubbleItem>
            </EditorBubble>
          </EditorContent>
        </EditorRoot>
      </div>
    </div>
  );
}
