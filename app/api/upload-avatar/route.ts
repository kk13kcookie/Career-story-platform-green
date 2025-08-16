import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const user_id = formData.get('user_id') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Create unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${user_id}-${Date.now()}.${fileExtension}`
    const filePath = `avatars/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data: _uploadData, error: uploadError } = await supabaseServer.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload file' 
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseServer.storage
      .from('avatars')
      .getPublicUrl(filePath)

    if (!urlData.publicUrl) {
      return NextResponse.json({ 
        error: 'Failed to get public URL' 
      }, { status: 500 })
    }

    // Update user profile with new avatar URL
    const { data: updatedUser, error: updateError } = await supabaseServer
      .from('users')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', user_id)
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      // Try to clean up uploaded file
      await supabaseServer.storage
        .from('avatars')
        .remove([filePath])
      
      return NextResponse.json({ 
        error: 'Failed to update profile' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Avatar uploaded successfully',
      avatar_url: urlData.publicUrl,
      user: updatedUser
    })

  } catch (error) {
    console.error('Avatar upload API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const avatar_url = searchParams.get('avatar_url')

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!avatar_url) {
      return NextResponse.json({ error: 'Avatar URL is required' }, { status: 400 })
    }

    // SECURITY: Basic user verification
    const { data: userExists, error: userError } = await supabaseServer
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single()

    if (userError || !userExists) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 })
    }

    // Extract file path from URL
    const urlParts = avatar_url.split('/avatars/')
    if (urlParts.length !== 2) {
      return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 })
    }
    
    const filePath = `avatars/${urlParts[1]}`

    // Delete from storage
    const { error: deleteError } = await supabaseServer.storage
      .from('avatars')
      .remove([filePath])

    if (deleteError) {
      console.error('Delete error:', deleteError)
      // Continue with profile update even if file delete fails
    }

    // Update user profile to remove avatar URL
    const { data: updatedUser, error: updateError } = await supabaseServer
      .from('users')
      .update({ avatar_url: null })
      .eq('id', user_id)
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update profile' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Avatar deleted successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Avatar delete API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}