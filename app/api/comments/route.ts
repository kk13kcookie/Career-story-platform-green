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
        user_id,
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

export async function PUT(request: NextRequest) {
  try {
    const { comment_id, content, user_id } = await request.json()

    if (!comment_id || !content || !user_id) {
      return NextResponse.json({ error: 'Comment ID, content, and User ID are required' }, { status: 400 })
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

    // Check if user owns the comment
    const { data: commentOwnership, error: ownershipError } = await supabaseServer
      .from('comments')
      .select('user_id')
      .eq('id', comment_id)
      .single()

    if (ownershipError || !commentOwnership) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (commentOwnership.user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to edit this comment' }, { status: 403 })
    }

    // Update comment
    const { data: comment, error: updateError } = await supabaseServer
      .from('comments')
      .update({
        content: sanitizedContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', comment_id)
      .select(`
        id,
        content,
        created_at,
        updated_at,
        user_id,
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

    if (updateError) {
      console.error('Error updating comment:', updateError)
      return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Error in comments PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const comment_id = searchParams.get('comment_id')
    const user_id = searchParams.get('user_id')

    if (!comment_id || !user_id) {
      return NextResponse.json({ error: 'Comment ID and User ID are required' }, { status: 400 })
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

    // Check if user owns the comment
    const { data: commentOwnership, error: ownershipError } = await supabaseServer
      .from('comments')
      .select('user_id')
      .eq('id', comment_id)
      .single()

    if (ownershipError || !commentOwnership) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (commentOwnership.user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to delete this comment' }, { status: 403 })
    }

    // Delete comment
    const { error: deleteError } = await supabaseServer
      .from('comments')
      .delete()
      .eq('id', comment_id)

    if (deleteError) {
      console.error('Error deleting comment:', deleteError)
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in comments DELETE API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}