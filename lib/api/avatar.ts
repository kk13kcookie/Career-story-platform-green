export interface UploadAvatarResponse {
  message: string
  avatar_url: string
  user: {
    id: string
    avatar_url: string | null
    [key: string]: any
  }
}

export interface DeleteAvatarResponse {
  message: string
  user: {
    id: string
    avatar_url: string | null
    [key: string]: any
  }
}

export async function uploadAvatar(userId: string, file: File): Promise<UploadAvatarResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('user_id', userId)

  const response = await fetch('/api/upload-avatar', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to upload avatar')
  }

  return response.json()
}

export async function deleteAvatar(userId: string, avatarUrl: string): Promise<DeleteAvatarResponse> {
  const response = await fetch(`/api/upload-avatar?user_id=${userId}&avatar_url=${encodeURIComponent(avatarUrl)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete avatar')
  }

  return response.json()
}

export function validateImageFile(file: File): string | null {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return 'File too large. Maximum size is 5MB.'
  }

  return null // No error
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}