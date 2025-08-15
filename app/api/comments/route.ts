import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    const { post_id, content, user_id } = await request.json()

    if (!post_id || !content || !user_id) {
      return NextResponse.json({ error: 'Post ID, content, and User ID are required' }, { status: 400 })
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

    if (content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Comment is too long (max 1000 characters)' }, { status: 400 })
    }

    // SECURITY: Basic XSS protection - sanitize content
    const sanitizedContent = content.trim().replace(/<script[^>]*>.*?<\/script>/gi, '')

    // Insert comment
    const { data: comment, error: insertError } = await supabaseServer
      .from('comments')
      .insert({
        user_id: user_id,
        post_id: post_id,
        content: sanitizedContent
      })
      .select(`
        id,
        content,
        created_at,
        users:user_id (
          id,
          name,
          username,
          avatar_url,
          is_premium,
          is_verified
        )
      `)
      .single()

    if (insertError) {
      console.error('Error creating comment:', insertError)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }


    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Error in comments POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const post_id = searchParams.get('post_id')

    if (!post_id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Fetch comments for the post
    const { data: comments, error } = await supabaseServer
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        users:user_id (
          id,
          name,
          username,
          avatar_url,
          is_premium,
          is_verified
        )
      `)
      .eq('post_id', post_id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    console.error('Error in comments GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}