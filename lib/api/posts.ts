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

export async function createPost(data: CreatePostData & { user_id: string }): Promise<{ post: Post } | { error: string }> {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

// Like/Unlike functionality
export async function toggleLike(postId: string, userId: string): Promise<{ liked: boolean } | { error: string }> {
  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id: postId, user_id: userId }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to toggle like' }
    }

    return { liked: result.liked }
  } catch (error) {
    console.error('Error toggling like:', error)
    return { error: 'Network error occurred' }
  }
}

export async function checkLikeStatus(postId: string, userId: string): Promise<{ liked: boolean } | { error: string }> {
  try {
    const response = await fetch(`/api/likes?post_id=${postId}&user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to check like status' }
    }

    return { liked: result.liked }
  } catch (error) {
    console.error('Error checking like status:', error)
    return { error: 'Network error occurred' }
  }
}

// Comment functionality
export interface Comment {
  id: string
  content: string
  created_at: string
  users: {
    id: string
    name: string | null
    username: string | null
    avatar_url: string | null
    is_premium: boolean
    is_verified: boolean
  } | null
}

export async function createComment(postId: string, content: string, userId: string): Promise<{ comment: Comment } | { error: string }> {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id: postId, content, user_id: userId }),
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to create comment' }
    }

    return { comment: result.comment }
  } catch (error) {
    console.error('Error creating comment:', error)
    return { error: 'Network error occurred' }
  }
}

export async function fetchComments(postId: string): Promise<{ comments: Comment[] } | { error: string }> {
  try {
    const response = await fetch(`/api/comments?post_id=${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to fetch comments' }
    }

    return { comments: result.comments }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return { error: 'Network error occurred' }
  }
}