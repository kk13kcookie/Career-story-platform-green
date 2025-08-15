import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user profile with post statistics
    const { data: profile, error: profileError } = await supabaseServer
      .from('users')
      .select(`
        *,
        posts:posts(count),
        followers:follows!follows_following_id_fkey(count),
        following:follows!follows_follower_id_fkey(count)
      `)
      .eq('id', user_id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Get user's recent posts
    const { data: recentPosts, error: postsError } = await supabaseServer
      .from('posts')
      .select(`
        id,
        title,
        content,
        category,
        tags,
        likes_count,
        comments_count,
        views_count,
        created_at
      `)
      .eq('user_id', user_id)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (postsError) {
      console.error('Posts fetch error:', postsError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    return NextResponse.json({
      profile: {
        ...profile,
        posts_count: profile.posts?.[0]?.count || 0,
        followers_count: profile.followers?.[0]?.count || 0,
        following_count: profile.following?.[0]?.count || 0
      },
      recent_posts: recentPosts || []
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      name, 
      username, 
      bio, 
      location, 
      website, 
      current_job_role, 
      company, 
      experience, 
      skills 
    } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
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

    // SECURITY: Basic input validation and sanitization
    const sanitizedData = {
      name: name?.trim().substring(0, 100) || null,
      username: username?.trim().toLowerCase().substring(0, 50) || null,
      bio: bio?.trim().substring(0, 500) || null,
      location: location?.trim().substring(0, 100) || null,
      website: website?.trim().substring(0, 200) || null,
      current_job_role: current_job_role?.trim().substring(0, 100) || null,
      company: company?.trim().substring(0, 100) || null,
      experience: experience?.trim().substring(0, 50) || null,
      skills: Array.isArray(skills) ? skills.slice(0, 20).map(skill => 
        typeof skill === 'string' ? skill.trim().substring(0, 50) : ''
      ).filter(skill => skill.length > 0) : []
    }

    // Check if username is already taken (if provided)
    if (sanitizedData.username) {
      const { data: existingUser, error: usernameError } = await supabaseServer
        .from('users')
        .select('id')
        .eq('username', sanitizedData.username)
        .neq('id', user_id)
        .single()

      if (!usernameError && existingUser) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
      }
    }

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabaseServer
      .from('users')
      .update(sanitizedData)
      .eq('id', user_id)
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile: updatedProfile })

  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}