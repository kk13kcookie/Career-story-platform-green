import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    const { post_id, user_id } = await request.json()

    if (!post_id || !user_id) {
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

    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabaseServer
      .from('likes')
      .select('id')
      .eq('user_id', user_id)
      .eq('post_id', post_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing like:', checkError)
      return NextResponse.json({ error: 'Failed to check like status' }, { status: 500 })
    }

    if (existingLike) {
      // Unlike: Remove the like
      const { error: deleteError } = await supabaseServer
        .from('likes')
        .delete()
        .eq('user_id', user_id)
        .eq('post_id', post_id)

      if (deleteError) {
        console.error('Error removing like:', deleteError)
        return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 })
      }


      return NextResponse.json({ liked: false })
    } else {
      // Like: Add the like
      const { error: insertError } = await supabaseServer
        .from('likes')
        .insert({
          user_id: user_id,
          post_id: post_id
        })

      if (insertError) {
        console.error('Error adding like:', insertError)
        return NextResponse.json({ error: 'Failed to add like' }, { status: 500 })
      }


      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error in likes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const post_id = searchParams.get('post_id')
    const user_id = searchParams.get('user_id')

    if (!post_id || !user_id) {
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

    // Check if user has liked this post
    const { data: like, error } = await supabaseServer
      .from('likes')
      .select('id')
      .eq('user_id', user_id)
      .eq('post_id', post_id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking like status:', error)
      return NextResponse.json({ error: 'Failed to check like status' }, { status: 500 })
    }

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('Error in likes GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}