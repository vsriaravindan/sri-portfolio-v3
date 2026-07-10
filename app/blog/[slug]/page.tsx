'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { sbBrowser } from '@/lib/supabase-browser';
import { EditorContent, EditorRoot, JSONContent } from 'novel';
import { ArrowLeft, Calendar, Clock, Loader2 } from 'lucide-react';
import type { Post } from '@/lib/posts';
import StarterKit from '@tiptap/starter-kit';

const extensions = [StarterKit];

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    sbBrowser
      .from('posts' as any)
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }: any) => {
        if (!error && data) setPost(data as Post);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 text-center sm:px-10 sm:pt-36">
        <h1 className="display-head text-[length:var(--type-display-lg)]">Not Found</h1>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">This post doesn&apos;t exist.</p>
        <Link href="/blog" className="btn btn-ghost mt-8">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <Link href="/blog" className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]">
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      <header className="mt-8">
        {post.cover_url && (
          <img src={post.cover_url} alt={post.title} className="mb-8 w-full rounded-sm object-cover" style={{ maxHeight: '400px' }} />
        )}
        <h1 className="display-head text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          {post.read_time && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.read_time} min read
            </span>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(post.tags ?? []).map((tag) => (
              <span key={tag} className="pill text-[0.55rem]">#{tag}</span>
            ))}
          </div>
        )}
      </header>

      <div className="prose-custom mt-10">
        <EditorRoot>
          <EditorContent
            initialContent={post.content as JSONContent}
            editable={false}
            extensions={extensions}
            className="novel-reader"
          />
        </EditorRoot>
      </div>
    </article>
  );
}
