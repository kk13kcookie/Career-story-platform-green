'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { User, Edit, MapPin, Globe, Briefcase, Calendar, Heart, MessageSquare, Eye, X, Camera, Trash2 } from 'lucide-react'
import { fetchProfile, updateProfile, UserProfile, UserPost } from '@/lib/api/profile'
import { uploadAvatar, deleteAvatar, validateImageFile } from '@/lib/api/avatar'
import { useAuth } from '@/components/auth/auth-provider'

interface ProfileDialogProps {
  userId: string
  trigger: React.ReactNode
}

export function ProfileDialog({ userId, trigger }: ProfileDialogProps) {
  const { user, refreshProfile } = useAuth()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recentPosts, setRecentPosts] = useState<UserPost[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deletingAvatar, setDeletingAvatar] = useState(false)
  
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    current_job_role: '',
    company: '',
    experience: '',
    skills: [] as string[],
    newSkill: ''
  })

  const isOwnProfile = user?.id === userId

  useEffect(() => {
    if (open) {
      loadProfile()
    }
  }, [open])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProfile(userId)
      setProfile(data.profile)
      setRecentPosts(data.recent_posts)
      
      // Initialize edit form with current data
      setEditForm({
        name: data.profile.name || '',
        username: data.profile.username || '',
        bio: data.profile.bio || '',
        location: data.profile.location || '',
        website: data.profile.website || '',
        current_job_role: data.profile.current_job_role || '',
        company: data.profile.company || '',
        experience: data.profile.experience || '',
        skills: data.profile.skills || [],
        newSkill: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    try {
      setSaving(true)
      setError(null)
      
      const updatedProfile = await updateProfile(userId, {
        name: editForm.name || undefined,
        username: editForm.username || undefined,
        bio: editForm.bio || undefined,
        location: editForm.location || undefined,
        website: editForm.website || undefined,
        current_job_role: editForm.current_job_role || undefined,
        company: editForm.company || undefined,
        experience: editForm.experience || undefined,
        skills: editForm.skills
      })
      
      setProfile({ ...profile, ...updatedProfile })
      setEditing(false)
      
      // 自分のプロフィールを更新した場合、グローバルプロフィールも更新
      if (user?.id === userId) {
        await refreshProfile()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (editForm.newSkill.trim() && !editForm.skills.includes(editForm.newSkill.trim())) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, editForm.newSkill.trim()],
        newSkill: ''
      })
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) return

    // Validate file
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setUploadingAvatar(true)
      setError(null)

      const result = await uploadAvatar(userId, file)
      
      // Update local profile state with cache busting
      const avatarUrlWithTimestamp = `${result.avatar_url}?t=${Date.now()}`
      setProfile({ ...profile, avatar_url: avatarUrlWithTimestamp })
      
      // Refresh global profile if this is the current user
      if (user?.id === userId) {
        await refreshProfile()
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
      // Reset input
      event.target.value = ''
    }
  }

  const handleAvatarDelete = async () => {
    if (!profile?.avatar_url) return

    try {
      setDeletingAvatar(true)
      setError(null)

      await deleteAvatar(userId, profile.avatar_url)
      
      // Update local profile state
      setProfile({ ...profile, avatar_url: null })
      
      // Refresh global profile if this is the current user
      if (user?.id === userId) {
        await refreshProfile()
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete avatar')
    } finally {
      setDeletingAvatar(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'success': return '成功体験'
      case 'failure': return '失敗談'
      case 'advice': return 'アドバイス'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failure': return 'bg-red-100 text-red-800'
      case 'advice': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              プロフィール
            </span>
            {isOwnProfile && !editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            ユーザーのプロフィール情報と投稿履歴を表示します
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
            <Button variant="outline" onClick={loadProfile} className="mt-4">
              再試行
            </Button>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={profile.avatar_url || undefined} 
                    key={profile.avatar_url || 'default'}
                  />
                  <AvatarFallback className="text-lg">
                    {profile.name?.[0] || profile.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Avatar Upload/Delete Controls - Only show for own profile */}
                {isOwnProfile && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <label 
                      htmlFor="avatar-upload" 
                      className={`p-2 bg-white border-2 border-gray-200 rounded-full shadow-md hover:bg-gray-50 cursor-pointer transition-colors ${
                        uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="sr-only"
                      />
                    </label>
                    
                    {profile.avatar_url && (
                      <button
                        onClick={handleAvatarDelete}
                        disabled={deletingAvatar}
                        className={`p-2 bg-white border-2 border-gray-200 rounded-full shadow-md hover:bg-red-50 hover:border-red-300 transition-colors ${
                          deletingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Upload/Delete Loading Indicators */}
                {(uploadingAvatar || deletingAvatar) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">名前</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="フルネーム"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">ユーザー名</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">自己紹介</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="あなたのキャリアストーリーを簡潔に紹介してください"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">所在地</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="東京都"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">ウェブサイト</Label>
                        <Input
                          id="website"
                          value={editForm.website}
                          onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="job">現在の職種</Label>
                        <Input
                          id="job"
                          value={editForm.current_job_role}
                          onChange={(e) => setEditForm({ ...editForm, current_job_role: e.target.value })}
                          placeholder="ソフトウェアエンジニア"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">会社</Label>
                        <Input
                          id="company"
                          value={editForm.company}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                          placeholder="株式会社Example"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="experience">経験年数</Label>
                      <Input
                        id="experience"
                        value={editForm.experience}
                        onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                        placeholder="5年"
                      />
                    </div>

                    <div>
                      <Label>スキル</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={editForm.newSkill}
                          onChange={(e) => setEditForm({ ...editForm, newSkill: e.target.value })}
                          placeholder="スキルを追加"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button type="button" onClick={addSkill}>追加</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editForm.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeSkill(skill)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? '保存中...' : '保存'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        キャンセル
                      </Button>
                    </div>
                    
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    
                    {/* Avatar Upload Help Text */}
                    {isOwnProfile && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          💡 プロフィール画像をアップロードするには、アバター右下のカメラアイコンをクリックしてください。
                          <br />
                          <span className="text-xs text-blue-600">
                            対応形式: JPEG, PNG, WebP (最大5MB)
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{profile.name || 'Unknown User'}</h2>
                      {profile.is_verified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">認証済み</Badge>
                      )}
                      {profile.is_premium && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Premium</Badge>
                      )}
                    </div>
                    
                    {profile.username && (
                      <p className="text-gray-600">@{profile.username}</p>
                    )}
                    
                    {profile.bio && (
                      <p className="text-gray-700">{profile.bio}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            ウェブサイト
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(profile.created_at).toLocaleDateString('ja-JP')}参加
                      </div>
                    </div>
                    
                    {(profile.current_job_role || profile.company) && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        {profile.current_job_role}
                        {profile.current_job_role && profile.company && ' @ '}
                        {profile.company}
                        {profile.experience && ` (${profile.experience})`}
                      </div>
                    )}
                    
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {profile.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{profile.posts_count}</div>
                <div className="text-sm text-gray-600">投稿</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.followers_count}</div>
                <div className="text-sm text-gray-600">フォロワー</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{profile.following_count}</div>
                <div className="text-sm text-gray-600">フォロー中</div>
              </div>
            </div>

            <Separator />

            {/* Recent Posts */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList>
                <TabsTrigger value="posts">最近の投稿</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="space-y-4">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryColor(post.category)}>
                          {getCategoryLabel(post.category)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-gray-700 line-clamp-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views_count}
                        </div>
                      </div>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    まだ投稿がありません
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}