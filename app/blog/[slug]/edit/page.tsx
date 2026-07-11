'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/supabase-browser';
import {
  EditorRoot, EditorContent, EditorBubble, EditorBubbleItem,
  EditorCommand, EditorCommandList, EditorCommandItem, EditorCommandEmpty,
  JSONContent,
} from 'novel';
import { ArrowLeft, Save, Loader2, Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered, Image, Trash2 } from 'lucide-react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { generateSlug } from '@/lib/posts';
import type { Editor } from '@tiptap/core';

const extensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  Placeholder.configure({ placeholder: 'Continue writing...' }),
];

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState('');
  const [postId, setPostId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    api.getUser().then(async (u: any) => {
      setUserId(u?.id ?? null);
      try {
        // Fetch the post via REST
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?slug=eq.${slug}&select=*`,
          { headers: api._headers() }
        );
        const posts = await res.json();
        const post = posts?.[0];
        if (!post) { setLoading(false); return; }
        setPostId(post.id);
        setAuthorId(post.author_id);
        setTitle(post.title || '');
        setPostSlug(post.slug || '');
        setTags((post.tags ?? []).join(', '));
        setExcerpt(post.excerpt || '');
        setContent(post.content || {});
        setCoverUrl(post.cover_url || '');
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    });
  }, [slug]);

  const isAuthor = userId && authorId && userId === authorId;

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !postId) return;
    if (!file.type.startsWith('image/')) { setError('Only image files'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB'); return; }
    setUploadingCover(true);
    setError('');
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `posts/${postId}/cover.${ext}`;
      const url = await api.uploadFile('covers', path, file);
      setCoverUrl(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleRemoveCover = async () => {
    if (!coverUrl || !postId) return;
    setError('');
    try {
      // Extract path from URL
      const parts = coverUrl.split('/public/covers/');
      if (parts.length === 2) {
        await api.deleteFile('covers', parts[1]);
      }
      setCoverUrl('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = useCallback(async () => {
    if (!title.trim() || !postId || !isAuthor) return;
    setSaving(true);
    setError('');
    try {
      const finalSlug = postSlug || generateSlug(title);
      const tb = await api.from('posts');
      await tb.update({
        title: title.trim(),
        slug: finalSlug,
        content: content ?? {},
        excerpt: excerpt.trim() || null,
        tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        cover_url: coverUrl || null,
        read_time: Math.max(1, Math.ceil(((content as any)?.text?.length ?? 0) / 1000)),
        updated_at: new Date().toISOString(),
      }, 'id', postId);
      router.push(`/blog/${finalSlug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [title, postSlug, content, excerpt, tags, coverUrl, postId, isAuthor, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (!postId) {
    return (
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 text-center sm:px-10 sm:pt-36">
        <h1 className="display-head text-[length:var(--type-display-lg)]">Not Found</h1>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">This post doesn&apos;t exist.</p>
        <Link href="/blog" className="btn btn-ghost mt-8">Back to Blog</Link>
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 text-center sm:px-10 sm:pt-36">
        <h1 className="display-head text-[length:var(--type-display-lg)]">Unauthorized</h1>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">You can only edit your own posts.</p>
        <Link href="/blog" className="btn btn-ghost mt-8">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-6 sm:px-10 sm:pt-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/blog/${slug}`} className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]">
          <ArrowLeft size={14} /> Back
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="btn btn-solid text-[0.65rem]"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-[var(--signal-error)]">{error}</p>}

      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (postSlug === generateSlug(title)) setPostSlug(generateSlug(e.target.value));
        }}
        placeholder="Post title..."
        className="w-full border-0 bg-transparent text-[length:var(--type-display-md)] font-bold leading-[var(--leading-display-md)] outline-none placeholder:text-[var(--text-muted)]"
        style={{ color: 'var(--text-primary)' }}
      />

      <div className="mt-3 flex flex-wrap gap-3">
        <input
          type="text"
          value={postSlug}
          onChange={(e) => setPostSlug(e.target.value)}
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

      {/* Cover image */}
      <div className="mt-4">
        {coverUrl ? (
          <div className="relative mb-2">
            <img src={coverUrl} alt="Cover" className="max-h-48 w-full rounded-sm object-cover" />
            <button
              onClick={handleRemoveCover}
              className="absolute right-2 top-2 rounded-sm p-1.5"
              style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingCover}
            className="btn btn-ghost w-full gap-2 text-[0.65rem]"
          >
            {uploadingCover ? <Loader2 size={12} className="animate-spin" /> : <Image size={12} />}
            {uploadingCover ? 'Uploading...' : 'Add Cover Image'}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
      </div>

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
