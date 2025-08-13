import { supabase } from '@/lib/supabase/client'

export interface CreatePostData {
  title: string
  content: string
  category: 'success' | 'failure' | 'advice'
  tags?: string[]
  career_level?: string
  career_stage?: string
}

export interface Post {
  id: string
  user_id: string
  title: string
  content: string
  category: string
  tags: string[]
  career_level: string | null
  career_stage: string | null
  read_time: number
  likes_count: number
  comments_count: number
  views_count: number
  is_published: boolean
  created_at: string
  updated_at: string
  users: {
    id: string
    name: string | null
    username: string | null
    avatar_url: string | null
    is_premium: boolean
    is_verified: boolean
    current_job_role: string | null
  } | null
}

export async function createPost(data: CreatePostData): Promise<{ post: Post } | { error: string }> {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      return { error: 'Authentication required' }
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to create post' }
    }

    return { post: result.post }
  } catch (error) {
    console.error('Error creating post:', error)
    return { error: 'Network error occurred' }
  }
}

export async function fetchPosts(): Promise<{ posts: Post[] } | { error: string }> {
  try {
    const response = await fetch('/api/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to fetch posts' }
    }

    return { posts: result.posts }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { error: 'Network error occurred' }
  }
}