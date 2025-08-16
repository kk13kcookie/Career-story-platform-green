import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server-client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, category, tags, career_level, career_stage, user_id } = await request.json()
    const postId = params.id

    // Validate input
    if (!title?.trim() || !content?.trim() || !category || !user_id || !postId) {
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

    // Check if user owns the post
    const { data: postOwnership, error: ownershipError } = await supabaseServer
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (ownershipError || !postOwnership) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (postOwnership.user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to edit this post' }, { status: 403 })
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    // Update post using server client
    const { data: post, error } = await supabaseServer
      .from('posts')
      .update({
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags || [],
        career_level: career_level || null,
        career_stage: career_stage || null,
        read_time: readTime,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
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
      console.error('Error updating post:', error)
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const postId = params.id

    if (!user_id || !postId) {
      return NextResponse.json({ error: 'Post ID and User ID are required' }, { status: 400 })
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

    // Check if user owns the post
    const { data: postOwnership, error: ownershipError } = await supabaseServer
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (ownershipError || !postOwnership) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (postOwnership.user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to delete this post' }, { status: 403 })
    }

    // Delete post
    const { error: deleteError } = await supabaseServer
      .from('posts')
      .delete()
      .eq('id', postId)

    if (deleteError) {
      console.error('Error deleting post:', deleteError)
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}