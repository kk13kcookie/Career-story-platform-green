import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with service role for server operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: posts, error } = await supabase
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
    const { title, content, category, tags, career_level, career_stage } = await request.json()
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '')
    
    // Verify user with server-side client
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Validate input
    if (!title?.trim() || !content?.trim() || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['success', 'failure', 'advice'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    // Insert post
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert([
        {
          user_id: user.id,
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