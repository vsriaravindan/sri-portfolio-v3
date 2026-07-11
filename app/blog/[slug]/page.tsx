import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import BlogPostReader from './BlogPostReader';
import BlogActions from './BlogActions';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch author profile
  let author = null;
  if (post.author_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, github_url, bio')
      .eq('id', post.author_id)
      .maybeSingle();
    author = profile;
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
            {(post.tags ?? []).map((tag: string) => (
              <span key={tag} className="pill text-[0.55rem]">#{tag}</span>
            ))}
          </div>
        )}
      </header>

      {/* Author profile card */}
      {author && (
        <div
          className="mt-8 flex items-center gap-4 rounded-sm border p-4"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.display_name || ''}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'var(--bg-surface)' }}
            >
              <User size={16} className="text-[var(--text-muted)]" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{author.display_name || 'Author'}</p>
            {author.bio && (
              <p className="text-[0.65rem] text-[var(--text-muted)]">{author.bio}</p>
            )}
          </div>
        </div>
      )}

      <div className="prose-custom mt-10">
        <BlogPostReader content={post.content} />
      </div>

      {/* Likes + Comments */}
      <BlogActions postId={post.id} />
    </article>
  );
}
