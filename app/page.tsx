"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { createPost, fetchPosts, toggleLike, checkLikeStatus, createComment, fetchComments, updateComment, deleteComment, type Post, type Comment } from "@/lib/api/posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  Search,
  TrendingUp,
  Users,
  Bell,
  Plus,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Crown,
  Lightbulb,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Menu,
  Compass,
  BookOpen,
  Sparkles,
  TrendingDown,
  Calendar,
  Eye,
  Award,
  Edit3,
  Trash2,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import { LoginDialog } from "@/components/auth/login-dialog"
import { ProfileDialog } from "@/components/profile/profile-dialog"

// Sample stories moved to separate file to reduce bundle size
// const stories = [...] // Unused static data - removed for performance

const trendingTopics = [
  { tag: "エンジニア転職", posts: "2.1K", trend: "up" },
  { tag: "副業", posts: "1.8K", trend: "up" },
  { tag: "起業", posts: "956", trend: "down" },
  { tag: "キャリアチェンジ", posts: "743", trend: "up" },
]

const mentors = [
  {
    name: "田中キャリア",
    username: "@tanaka_pro",
    role: "IT業界のプロ",
    avatar: "/placeholder.svg?height=40&width=40",
    experience: "15年",
    rating: 4.9,
  },
  {
    name: "佐藤デザイン",
    username: "@sato_design",
    role: "UXデザイナー",
    avatar: "/placeholder.svg?height=40&width=40",
    experience: "8年",
    rating: 4.8,
  },
]

function CareerStoryPlatform() {
  const { user, profile, loading, signOut } = useAuth()
  
  // プロフィール更新時にコメントと投稿のユーザー情報も同期する
  useEffect(() => {
    if (profile && user?.id) {
      // コメントのユーザー情報を更新
      setCommentsMap(prevMap => {
        const newMap = new Map(prevMap)
        for (const [postId, comments] of newMap) {
          const updatedComments = comments.map(comment => {
            if (comment.user_id === user.id) {
              return {
                ...comment,
                users: comment.users ? {
                  ...comment.users,
                  name: profile.name,
                  username: profile.username,
                  avatar_url: profile.avatar_url,
                  is_premium: profile.is_premium,
                  is_verified: profile.is_verified
                } : null
              }
            }
            return comment
          })
          newMap.set(postId, updatedComments)
        }
        return newMap
      })

      // 投稿のユーザー情報を更新
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.user_id === user.id) {
            return {
              ...post,
              users: post.users ? {
                ...post.users,
                name: profile.name,
                username: profile.username,
                avatar_url: profile.avatar_url,
                is_premium: profile.is_premium,
                is_verified: profile.is_verified
              } : null
            }
          }
          return post
        })
      )
    }
  }, [profile, user?.id])
  const [showPostForm, setShowPostForm] = useState(false)
  const [newStory, setNewStory] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("成功体験")
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [submittingPost, setSubmittingPost] = useState(false)
  
  // Like and comment functionality
  const [likesMap, setLikesMap] = useState<Map<string, boolean>>(new Map())
  const [commentsMap, setCommentsMap] = useState<Map<string, Comment[]>>(new Map())
  const [showCommentsMap, setShowCommentsMap] = useState<Map<string, boolean>>(new Map())
  const [newCommentMap, setNewCommentMap] = useState<Map<string, string>>(new Map())
  const [submittingCommentMap, setSubmittingCommentMap] = useState<Map<string, boolean>>(new Map())
  
  // Comment editing and deleting functionality
  const [editingCommentMap, setEditingCommentMap] = useState<Map<string, boolean>>(new Map())
  const [editCommentContentMap, setEditCommentContentMap] = useState<Map<string, string>>(new Map())
  const [updatingCommentMap, setUpdatingCommentMap] = useState<Map<string, boolean>>(new Map())
  const [deletingCommentMap, setDeletingCommentMap] = useState<Map<string, boolean>>(new Map())


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "すべて":
        return <BookOpen className="w-4 h-4 text-blue-500" />
      case "成功体験":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case "失敗談":
        return <XCircle className="w-4 h-4 text-rose-500" />
      case "アドバイス":
        return <Lightbulb className="w-4 h-4 text-amber-500" />
      default:
        return <Star className="w-4 h-4 text-emerald-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "成功体験":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "失敗談":
        return "bg-rose-50 text-rose-700 border-rose-200"
      case "アドバイス":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
  }

  const getCareerLevelColor = (level: string) => {
    switch (level) {
      case "初心者":
        return "bg-green-100 text-green-800"
      case "中級者":
        return "bg-teal-100 text-teal-800"
      case "上級者":
        return "bg-emerald-100 text-emerald-800"
      case "エキスパート":
        return "bg-lime-100 text-lime-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  // Handle like toggle
  const handleLikeToggle = async (postId: string) => {
    if (!user) {
      setShowLoginDialog(true)
      return
    }

    try {
      const result = await toggleLike(postId, user.id)
      if ('liked' in result) {
        const newLikesMap = new Map(likesMap)
        newLikesMap.set(postId, result.liked)
        setLikesMap(newLikesMap)

        // Update posts count
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likes_count: result.liked ? post.likes_count + 1 : post.likes_count - 1
              }
            }
            return post
          })
        )
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  // Handle comment toggle visibility
  const toggleComments = async (postId: string) => {
    const newShowCommentsMap = new Map(showCommentsMap)
    const isCurrentlyShowing = showCommentsMap.get(postId) || false
    
    if (isCurrentlyShowing) {
      newShowCommentsMap.set(postId, false)
      setShowCommentsMap(newShowCommentsMap)
    } else {
      newShowCommentsMap.set(postId, true)
      setShowCommentsMap(newShowCommentsMap)
      
      // Load comments if not already loaded
      if (!commentsMap.has(postId)) {
        const result = await fetchComments(postId)
        if ('comments' in result) {
          const newCommentsMap = new Map(commentsMap)
          newCommentsMap.set(postId, result.comments)
          setCommentsMap(newCommentsMap)
        }
      }
    }
  }

  // Handle comment submission
  const handleCommentSubmit = async (postId: string) => {
    if (!user) {
      setShowLoginDialog(true)
      return
    }

    const commentText = newCommentMap.get(postId) || ''
    if (!commentText.trim()) return

    const newSubmittingMap = new Map(submittingCommentMap)
    newSubmittingMap.set(postId, true)
    setSubmittingCommentMap(newSubmittingMap)

    try {
      const result = await createComment(postId, commentText.trim(), user.id)
      if ('comment' in result) {
        // Add new comment to the map
        const newCommentsMap = new Map(commentsMap)
        const currentComments = newCommentsMap.get(postId) || []
        newCommentsMap.set(postId, [...currentComments, result.comment])
        setCommentsMap(newCommentsMap)

        // Clear the input
        const newCommentInputMap = new Map(newCommentMap)
        newCommentInputMap.set(postId, '')
        setNewCommentMap(newCommentInputMap)

        // Update posts count
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments_count: post.comments_count + 1
              }
            }
            return post
          })
        )
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      const newSubmittingMap = new Map(submittingCommentMap)
      newSubmittingMap.set(postId, false)
      setSubmittingCommentMap(newSubmittingMap)
    }
  }

  // Update comment input
  const updateCommentInput = (postId: string, value: string) => {
    const newCommentInputMap = new Map(newCommentMap)
    newCommentInputMap.set(postId, value)
    setNewCommentMap(newCommentInputMap)
  }

  // Start editing comment
  const startEditingComment = (commentId: string, currentContent: string) => {
    const newEditingMap = new Map(editingCommentMap)
    const newContentMap = new Map(editCommentContentMap)
    newEditingMap.set(commentId, true)
    newContentMap.set(commentId, currentContent)
    setEditingCommentMap(newEditingMap)
    setEditCommentContentMap(newContentMap)
  }

  // Cancel editing comment
  const cancelEditingComment = (commentId: string) => {
    const newEditingMap = new Map(editingCommentMap)
    const newContentMap = new Map(editCommentContentMap)
    newEditingMap.delete(commentId)
    newContentMap.delete(commentId)
    setEditingCommentMap(newEditingMap)
    setEditCommentContentMap(newContentMap)
  }

  // Update edit comment content
  const updateEditCommentContent = (commentId: string, value: string) => {
    const newContentMap = new Map(editCommentContentMap)
    newContentMap.set(commentId, value)
    setEditCommentContentMap(newContentMap)
  }

  // Handle comment update
  const handleCommentUpdate = async (commentId: string, postId: string) => {
    if (!user) return

    const updatedContent = editCommentContentMap.get(commentId) || ''
    if (!updatedContent.trim()) return

    const newUpdatingMap = new Map(updatingCommentMap)
    newUpdatingMap.set(commentId, true)
    setUpdatingCommentMap(newUpdatingMap)

    try {
      const result = await updateComment(commentId, updatedContent.trim(), user.id)
      if ('comment' in result) {
        // Update comment in the map
        const newCommentsMap = new Map(commentsMap)
        const currentComments = newCommentsMap.get(postId) || []
        const updatedComments = currentComments.map(comment => 
          comment.id === commentId ? result.comment : comment
        )
        newCommentsMap.set(postId, updatedComments)
        setCommentsMap(newCommentsMap)

        // Cancel editing mode
        cancelEditingComment(commentId)
      } else {
        console.error('Error updating comment:', result.error)
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    } finally {
      const newUpdatingMap = new Map(updatingCommentMap)
      newUpdatingMap.set(commentId, false)
      setUpdatingCommentMap(newUpdatingMap)
    }
  }

  // Handle comment deletion
  const handleCommentDelete = async (commentId: string, postId: string) => {
    if (!user) return
    
    if (!confirm('このコメントを削除しますか？')) return

    const newDeletingMap = new Map(deletingCommentMap)
    newDeletingMap.set(commentId, true)
    setDeletingCommentMap(newDeletingMap)

    try {
      const result = await deleteComment(commentId, user.id)
      if ('success' in result) {
        // Remove comment from the map
        const newCommentsMap = new Map(commentsMap)
        const currentComments = newCommentsMap.get(postId) || []
        const filteredComments = currentComments.filter(comment => comment.id !== commentId)
        newCommentsMap.set(postId, filteredComments)
        setCommentsMap(newCommentsMap)

        // Update post comments count
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments_count: Math.max(0, post.comments_count - 1)
              }
            }
            return post
          })
        )
      } else {
        console.error('Error deleting comment:', result.error)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      const newDeletingMap = new Map(deletingCommentMap)
      newDeletingMap.set(commentId, false)
      setDeletingCommentMap(newDeletingMap)
    }
  }


  // Load posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoadingPosts(true)
      const result = await fetchPosts()
      if ('posts' in result) {
        setPosts(result.posts)
      } else {
        console.error('Failed to load posts:', result.error)
      }
      setLoadingPosts(false)
    }

    loadPosts()
  }, [])

  // Load like status for posts when user is authenticated
  useEffect(() => {
    const loadLikeStatuses = async () => {
      if (!user || posts.length === 0) return

      const newLikesMap = new Map(likesMap)
      
      for (const post of posts) {
        if (!likesMap.has(post.id)) {
          try {
            const result = await checkLikeStatus(post.id, user.id)
            if ('liked' in result) {
              newLikesMap.set(post.id, result.liked)
            }
          } catch (error) {
            console.error('Error checking like status:', error)
          }
        }
      }
      
      setLikesMap(newLikesMap)
    }

    loadLikeStatuses()
  }, [user, posts, likesMap])

  // Category mapping for API
  const getCategoryForAPI = (category: string) => {
    switch (category) {
      case "成功体験": return "success"
      case "失敗談": return "failure"
      case "アドバイス": return "advice"
      default: return "success"
    }
  }

  // Handle post submission
  const handleSubmitPost = async () => {
    if (!postTitle.trim() || !newStory.trim() || !user) {
      return
    }

    setSubmittingPost(true)
    try {
      const result = await createPost({
        title: postTitle.trim(),
        content: newStory.trim(),
        category: getCategoryForAPI(selectedCategory),
        tags: [],
        career_level: undefined,
        career_stage: undefined,
        user_id: user.id,
      })

      if ('post' in result) {
        // Add new post to the beginning of the list
        setPosts([result.post, ...posts])
        
        // Reset form
        setPostTitle("")
        setNewStory("")
        setSelectedCategory("成功体験")
        setShowPostForm(false)
      } else {
        console.error('Failed to create post:', result.error)
        alert('投稿の作成に失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('Error submitting post:', error)
      alert('投稿中にエラーが発生しました。')
    } finally {
      setSubmittingPost(false)
    }
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const shouldShowExpandButton = (text: string, maxLength = 150) => {
    return text.length > maxLength
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* ヘッダーナビゲーション */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  CareerStory
                </h1>
                <p className="text-xs text-gray-500">キャリアの成長物語</p>
              </div>
            </div>

            {/* 中央ナビゲーション */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" className="gap-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
                <Home className="w-4 h-4" />
                ホーム
              </Button>
              <Button variant="ghost" className="gap-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
                <Compass className="w-4 h-4" />
                発見
              </Button>
              <Button variant="ghost" className="gap-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
                <Users className="w-4 h-4" />
                メンター
              </Button>
            </nav>

            {/* 右側アクション */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ストーリーを検索..."
                  className="pl-10 w-64 bg-white/50 border-green-200 focus:border-emerald-400"
                />
              </div>
              {user && (
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-emerald-600">
                  <Bell className="w-5 h-5" />
                </Button>
              )}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage 
                          src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                          key={profile?.avatar_url || user.user_metadata?.avatar_url || 'default'}
                        />
                        <AvatarFallback>{(profile?.name || profile?.username || user.email)?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-gray-700">
                        {profile?.name || profile?.username || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <ProfileDialog 
                      userId={user.id} 
                      trigger={
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                          プロフィール
                        </div>
                      }
                    />
                    <DropdownMenuItem>設定</DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>ログアウト</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLoginDialog(true)}
                  className="text-gray-600 hover:text-emerald-600"
                >
                  ログイン
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>発見</DropdownMenuItem>
                  <DropdownMenuItem>メンター</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            {/* コントロールバー */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-green-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">キャリアストーリー</h2>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {posts.length} 件
                    </Badge>
                  </div>
                  <Button
                    onClick={() => user ? setShowPostForm(!showPostForm) : setShowLoginDialog(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    投稿
                  </Button>
                </div>
              </div>
            </div>

            {/* 投稿フォーム */}
            {showPostForm && user && (
              <Card className="mb-6 border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-green-200">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">あなたのキャリアストーリーを共有しましょう</p>
                      <p className="text-sm text-gray-600">推奨：500-800文字</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="投稿のタイトルを入力してください..."
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className="border-green-200 focus:border-emerald-400"
                        disabled={submittingPost}
                      />
                    </div>
                    <div className="flex gap-2 mb-4">
                      {["成功体験", "失敗談", "アドバイス"].map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          disabled={submittingPost}
                          className={
                            selectedCategory === category
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                              : "border-green-200 text-gray-600 hover:border-emerald-400"
                          }
                        >
                          {getCategoryIcon(category)}
                          <span className="ml-1">{category}</span>
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="あなたのキャリアストーリーを詳しく共有してください..."
                      value={newStory}
                      onChange={(e) => setNewStory(e.target.value)}
                      className="min-h-32 border-green-200 focus:border-emerald-400"
                      disabled={submittingPost}
                    />
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">効果的なストーリーのコツ</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• 具体的な状況：どんな課題や目標があったか</li>
                            <li>• 取った行動：どのような努力や工夫をしたか</li>
                            <li>• 得た結果：どんな成果や学びがあったか</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50/50">
                  <p className="text-sm text-gray-500">
                    文字数: {newStory.length} / タイトル: {postTitle.length}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPostForm(false)}
                      disabled={submittingPost}
                    >
                      キャンセル
                    </Button>
                    <Button 
                      onClick={handleSubmitPost}
                      disabled={submittingPost || !postTitle.trim() || !newStory.trim()}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    >
                      {submittingPost ? '投稿中...' : '投稿する'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* ストーリー一覧 */}
            <div className="space-y-6">
              {loadingPosts ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">まだ投稿がありません。最初の投稿をしてみませんか？</p>
                </div>
              ) : (
                <div>
                  {posts.map((story) => (
                    <Card
                  key={story.id}
                  className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <ProfileDialog
                        userId={story.user_id}
                        trigger={
                          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                            <Avatar className="border-2 border-green-200">
                              <AvatarImage 
                                src={story.users?.avatar_url || "/placeholder.svg"} 
                                key={`post-${story.id}-${story.users?.avatar_url || 'default'}`}
                              />
                              <AvatarFallback>{(story.users?.name || story.users?.username || 'U')[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800">{story.users?.name || story.users?.username || 'Unknown User'}</p>
                                {story.users?.is_premium && <Crown className="w-4 h-4 text-emerald-500" />}
                                {story.career_level && (
                                  <Badge className={getCareerLevelColor(story.career_level)} variant="secondary">
                                    {story.career_level}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>@{story.users?.username || story.users?.id?.slice(0, 8)}</span>
                                <span>•</span>
                                <span>{new Date(story.created_at).toLocaleDateString('ja-JP')}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {story.views_count}
                                </span>
                              </div>
                            </div>
                          </div>
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Badge className={`${getCategoryColor(story.category === 'success' ? '成功体験' : story.category === 'failure' ? '失敗談' : 'アドバイス')} border`}>
                          {getCategoryIcon(story.category === 'success' ? '成功体験' : story.category === 'failure' ? '失敗談' : 'アドバイス')}
                          <span className="ml-1">{story.category === 'success' ? '成功体験' : story.category === 'failure' ? '失敗談' : 'アドバイス'}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {story.read_time}分
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                        {story.title}
                      </h3>
                    </div>

                    <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                      {expandedPosts.has(story.id) ? story.content : truncateText(story.content)}
                    </div>

                    {shouldShowExpandButton(story.content) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(story.id)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0 h-auto font-medium"
                      >
                        {expandedPosts.has(story.id) ? "折りたたむ" : "続きを読む"}
                      </Button>
                    )}

                    {/* タグ */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {story.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0 bg-gradient-to-r from-gray-50/50 to-emerald-50/50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeToggle(story.id)}
                          className={`gap-2 transition-colors ${
                            likesMap.get(story.id) 
                              ? 'text-rose-500 bg-rose-50 hover:text-rose-600 hover:bg-rose-100' 
                              : 'text-gray-500 hover:text-rose-500 hover:bg-rose-50'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likesMap.get(story.id) ? 'fill-current' : ''}`} />
                          {story.likes_count}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleComments(story.id)}
                          className={`gap-2 transition-colors ${
                            showCommentsMap.get(story.id) 
                              ? 'text-blue-500 bg-blue-50 hover:text-blue-600 hover:bg-blue-100' 
                              : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          {story.comments_count}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-gray-500 hover:text-green-500 hover:bg-green-50"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-emerald-500 hover:bg-emerald-50"
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        {story.users?.is_premium && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            相談
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                  
                  {/* コメントセクション */}
                  {showCommentsMap.get(story.id) && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-4">
                      {/* コメント入力フォーム */}
                      {user && (
                        <div className="flex gap-3">
                          <Avatar className="border-2 border-green-200 flex-shrink-0">
                            <AvatarImage 
                              src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                              key={profile?.avatar_url || user.user_metadata?.avatar_url || 'default'}
                            />
                            <AvatarFallback>{(profile?.name || profile?.username || user.email || 'U')[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="コメントを追加..."
                              value={newCommentMap.get(story.id) || ''}
                              onChange={(e) => updateCommentInput(story.id, e.target.value)}
                              className="min-h-[80px] border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
                              maxLength={1000}
                            />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                {(newCommentMap.get(story.id) || '').length}/1000
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handleCommentSubmit(story.id)}
                                disabled={submittingCommentMap.get(story.id) || !(newCommentMap.get(story.id) || '').trim()}
                                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                              >
                                {submittingCommentMap.get(story.id) ? '投稿中...' : 'コメント'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* コメントリスト */}
                      <div className="space-y-3">
                        {(commentsMap.get(story.id) || []).map((comment) => (
                          <div key={comment.id} className="flex gap-3 bg-white rounded-lg p-3 border border-gray-100">
                            <Avatar className="border-2 border-green-200 flex-shrink-0">
                              <AvatarImage 
                                src={comment.users?.avatar_url || "/placeholder.svg"} 
                                key={`comment-${comment.id}-${comment.users?.avatar_url || 'default'}`}
                              />
                              <AvatarFallback>{(comment.users?.name || comment.users?.username || 'U')[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-gray-800">
                                    {comment.users?.name || comment.users?.username || 'Unknown User'}
                                  </span>
                                  {comment.users?.is_premium && <Crown className="w-3 h-3 text-emerald-500" />}
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                                    {comment.updated_at && comment.updated_at !== comment.created_at && (
                                      <span className="ml-1">(編集済み)</span>
                                    )}
                                  </span>
                                </div>
                                {/* コメント操作メニュー（自分のコメントのみ） */}
                                {user && comment.user_id === user.id && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                        <MoreVertical className="w-3 h-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem 
                                        onClick={() => startEditingComment(comment.id, comment.content)}
                                        disabled={editingCommentMap.get(comment.id)}
                                      >
                                        <Edit3 className="w-3 h-3 mr-2" />
                                        編集
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleCommentDelete(comment.id, story.id)}
                                        disabled={deletingCommentMap.get(comment.id)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="w-3 h-3 mr-2" />
                                        {deletingCommentMap.get(comment.id) ? '削除中...' : '削除'}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                              
                              {/* コメント内容または編集フォーム */}
                              {editingCommentMap.get(comment.id) ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={editCommentContentMap.get(comment.id) || ''}
                                    onChange={(e) => updateEditCommentContent(comment.id, e.target.value)}
                                    className="min-h-[60px] text-sm"
                                    placeholder="コメントを編集..."
                                    maxLength={1000}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleCommentUpdate(comment.id, story.id)}
                                      disabled={
                                        !editCommentContentMap.get(comment.id)?.trim() ||
                                        updatingCommentMap.get(comment.id)
                                      }
                                    >
                                      {updatingCommentMap.get(comment.id) ? '更新中...' : '更新'}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => cancelEditingComment(comment.id)}
                                      disabled={updatingCommentMap.get(comment.id)}
                                    >
                                      キャンセル
                                    </Button>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {editCommentContentMap.get(comment.id)?.length || 0}/1000文字
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                  {comment.content}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {(commentsMap.get(story.id) || []).length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">まだコメントがありません</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右サイドバー */}
          <div className="space-y-6">
            {/* おすすめメンター */}
            <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-lg text-gray-800">おすすめメンター</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentors.map((mentor, index) => (
                  <div key={index} className="p-3 hover:bg-emerald-50 rounded-lg transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <Link href="/profile" className="flex items-center gap-3 hover:opacity-80">
                        <Avatar className="border-2 border-green-200">
                          <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800 group-hover:text-emerald-600">{mentor.name}</p>
                          <p className="text-sm text-gray-500">{mentor.role}</p>
                        </div>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                      >
                        相談
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        経験 {mentor.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {mentor.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* トレンドトピック */}
            <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-lg text-gray-800">トレンド</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-gray-800 group-hover:text-emerald-600">#{topic.tag}</p>
                      <p className="text-sm text-gray-500">{topic.posts} 投稿</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {topic.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* プレミアム案内 */}
            <Card className="border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-emerald-800 mb-2">プレミアム会員</h3>
                  <p className="text-sm text-emerald-700 mb-4">メンターとの1対1相談やより詳細な機能にアクセス</p>
                  <div className="space-y-2 text-sm text-emerald-700 mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>無制限メッセージ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>メンター優先相談</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>優先サポート</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg">
                    月額1,000円で始める
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  )
}

export default CareerStoryPlatform
