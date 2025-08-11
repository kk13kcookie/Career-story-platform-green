"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { LoginDialog } from "@/components/auth/login-dialog"

const stories = [
  {
    id: 1,
    author: "田中太郎",
    username: "@tanaka_career",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "2時間前",
    category: "成功体験",
    careerLevel: "中級者",
    careerStage: "転職成功",
    title: "未経験からエンジニア転職して3年が経ちました。",
    content:
      "当時の私は営業職で、プログラミングの「プ」の字も知らない状況でした。しかし、毎日コツコツと学習を続け、ついに念願のエンジニア転職を果たすことができました。\n\n転職活動では多くの困難がありました。技術面接では基礎的な質問にも答えられず、何度も落ち込みました。でも諦めずに学習を続け、ポートフォリオを充実させ、最終的に理想の会社に入社できました。",
    likes: 234,
    comments: 45,
    views: 1200,
    isLiked: false,
    isPremium: false,
    tags: ["エンジニア転職", "未経験", "学習継続"],
    readTime: "3分",
  },
  {
    id: 2,
    author: "佐藤花子",
    username: "@sato_design",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "5時間前",
    category: "失敗談",
    careerLevel: "上級者",
    careerStage: "転職活動中",
    title: "転職活動で100社落ちた話",
    content:
      "デザイナーとして転職活動をしていた時期、なんと100社以上から不採用通知をもらいました。でもその経験があったからこそ、今の自分があります。\n\n最初は自分のスキルに自信を持っていました。しかし、面接を重ねるうちに、技術力だけでなく、コミュニケーション能力やチームワークの重要性を痛感しました。",
    likes: 189,
    comments: 67,
    views: 890,
    isLiked: true,
    isPremium: true,
    tags: ["転職活動", "デザイナー", "失敗から学ぶ"],
    readTime: "5分",
  },
  {
    id: 3,
    author: "山田一郎",
    username: "@yamada_startup",
    avatar: "/placeholder.svg?height=40&width=40",
    time: "1日前",
    category: "アドバイス",
    careerLevel: "エキスパート",
    careerStage: "起業",
    title: "スタートアップで学んだ3つのこと",
    content:
      "スタートアップで働いて分かったのは、スピード感、柔軟性、そして何より「失敗を恐れない心」の大切さでした。大企業とは全く違う環境で、多くのことを学ぶことができました。",
    likes: 156,
    comments: 23,
    views: 654,
    isLiked: false,
    isPremium: false,
    tags: ["スタートアップ", "起業", "学び"],
    readTime: "2分",
  },
]

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

export default function CareerStoryPlatform() {
  const [activeTab, setActiveTab] = useState("すべて")
  const [showPostForm, setShowPostForm] = useState(false)
  const [newStory, setNewStory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("成功体験")
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set())
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const getCategoryIcon = (category: string) => {
    switch (category) {
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

  const toggleExpanded = (postId: number) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const shouldShowExpandButton = (text: string, maxLength = 150) => {
    return text.length > maxLength
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
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-emerald-600">
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLoginDialog(true)}
                className="text-gray-600 hover:text-emerald-600"
              >
                ログイン
              </Button>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">キャリアストーリー</h2>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    247 新着
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {/* カテゴリータブ */}
                  <div className="flex gap-1 bg-white/80 rounded-xl p-1 border border-green-200">
                    {["すべて", "成功体験", "失敗談", "アドバイス"].map((tab) => (
                      <Button
                        key={tab}
                        variant={activeTab === tab ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab(tab)}
                        className={
                          activeTab === tab
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"
                            : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                        }
                      >
                        {getCategoryIcon(tab)}
                        <span className="ml-1 hidden sm:inline">{tab}</span>
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => setShowPostForm(!showPostForm)}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    投稿
                  </Button>
                </div>
              </div>
            </div>

            {/* 投稿フォーム */}
            {showPostForm && (
              <Card className="mb-6 border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-green-200">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">あなたのキャリアストーリーを共有しましょう</p>
                      <p className="text-sm text-gray-600">推奨：500-800文字</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      {["成功体験", "失敗談", "アドバイス"].map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
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
                  <p className="text-sm text-gray-500">現在のフェーズ（例：転職活動3ヶ月目）</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowPostForm(false)}>
                      キャンセル
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                      投稿する
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* ストーリー一覧 */}
            <div className="space-y-6">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className="border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Avatar className="border-2 border-green-200">
                          <AvatarImage src={story.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{story.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800">{story.author}</p>
                            {story.isPremium && <Crown className="w-4 h-4 text-emerald-500" />}
                            <Badge className={getCareerLevelColor(story.careerLevel)} variant="secondary">
                              {story.careerLevel}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{story.username}</span>
                            <span>•</span>
                            <span>{story.time}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {story.views}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getCategoryColor(story.category)} border`}>
                          {getCategoryIcon(story.category)}
                          <span className="ml-1">{story.category}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {story.readTime}
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
                  </CardContent>

                  <CardFooter className="pt-0 bg-gradient-to-r from-gray-50/50 to-emerald-50/50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50"
                        >
                          <Heart className={`w-4 h-4 ${story.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                          {story.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {story.comments}
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
                        {story.isPremium && (
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
                </Card>
              ))}
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
