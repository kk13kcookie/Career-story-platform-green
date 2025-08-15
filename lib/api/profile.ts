export interface UserProfile {
  id: string
  email: string
  name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  website: string | null
  is_premium: boolean
  is_verified: boolean
  current_job_role: string | null
  company: string | null
  experience: string | null
  skills: string[]
  created_at: string
  updated_at: string
  posts_count: number
  followers_count: number
  following_count: number
}

export interface UserPost {
  id: string
  title: string
  content: string
  category: 'success' | 'failure' | 'advice'
  tags: string[]
  likes_count: number
  comments_count: number
  views_count: number
  created_at: string
}

export interface ProfileData {
  profile: UserProfile
  recent_posts: UserPost[]
}

export interface UpdateProfileData {
  name?: string
  username?: string
  bio?: string
  location?: string
  website?: string
  current_job_role?: string
  company?: string
  experience?: string
  skills?: string[]
}

export async function fetchProfile(userId: string): Promise<ProfileData> {
  const response = await fetch(`/api/profile?user_id=${userId}`)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch profile')
  }
  
  return response.json()
}

export async function updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      ...data
    }),
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to update profile')
  }
  
  const result = await response.json()
  return result.profile
}