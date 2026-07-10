import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/posts';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, tags, read_time, created_at, cover_url')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const list = (posts ?? []) as Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'tags' | 'read_time' | 'created_at' | 'cover_url'>[];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <p className="mono-label">Blog</p>
      <h1 className="display-head mt-4 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
        Thoughts &amp; <em>Stories</em>
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
        Articles about DevOps, cloud infrastructure, automation, and the occasional deep-dive into tools I build.
      </p>

      <div className="mt-12 space-y-1">
        {list.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--text-muted)]">No posts yet. Stay tuned.</p>
        )}
        {list.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="card-line card-line-interactive flex items-start gap-4 p-5 no-underline sm:p-6"
          >
            {post.cover_url && (
              <div className="mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-sm sm:h-16 sm:w-16">
                <img src={post.cover_url} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium">{post.title}</h3>
              {post.excerpt && (
                <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{post.excerpt}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.65rem] text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.read_time} min read
                  </span>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {(post.tags ?? []).map((tag) => (
                    <span key={tag} className="mono-label text-[0.5rem]" style={{ color: 'var(--accent)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <ArrowUpRight size={16} className="arrow-nudge mt-1 shrink-0 text-[var(--text-muted)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
