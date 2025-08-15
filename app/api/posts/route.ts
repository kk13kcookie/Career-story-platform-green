import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server-client'

export async function GET() {
  try {
    const { data: posts, error } = await supabaseServer
      .from('posts')
      .select(`
        *,
        users:user_id (
          id,
          name,
          username,
          avatar_url,
          is_premium,
          is_verified,
          current_job_role
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, category, tags, career_level, career_stage, user_id } = await request.json()
    
    // Validate input
    if (!title?.trim() || !content?.trim() || !category || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['success', 'failure', 'advice'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // SECURITY: Basic user verification - Check if user exists in database
    const { data: userExists, error: userError } = await supabaseServer
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single()

    if (userError || !userExists) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 })
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    // Insert post using server client
    const { data: post, error } = await supabaseServer
      .from('posts')
      .insert([
        {
          user_id: user_id,
          title: title.trim(),
          content: content.trim(),
          category,
          tags: tags || [],
          career_level: career_level || null,
          career_stage: career_stage || null,
          read_time: readTime,
          is_published: true,
        }
      ])
      .select(`
        *,
        users:user_id (
          id,
          name,
          username,
          avatar_url,
          is_premium,
          is_verified,
          current_job_role
        )
      `)
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}