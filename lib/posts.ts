import { supabase } from './supabase';

export type Post = {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: Record<string, unknown>;
  excerpt: string | null;
  cover_url: string | null;
  tags: string[];
  published: boolean;
  read_time: number | null;
  created_at: string;
  updated_at: string;
};

export type PostInsert = {
  title: string;
  slug: string;
  content?: Record<string, unknown>;
  excerpt?: string;
  cover_url?: string;
  tags?: string[];
  published?: boolean;
};

const postSelect = `
  id, author_id, title, slug, content, excerpt, cover_url,
  tags, published, read_time, created_at, updated_at
`;

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getMyPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Post;
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(postSelect)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Post;
}

export async function createPost(post: PostInsert) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function updatePost(id: string, updates: Partial<PostInsert>) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}
