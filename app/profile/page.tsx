"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  Search,
  Users,
  Bell,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Crown,
  Calendar,
  MapPin,
  LinkIcon,
  Edit3,
  CheckCircle,
  XCircle,
  Lightbulb,
  Star,
  MessageSquare,
  MoreHorizontal,
  UserPlus,
  Building,
  GraduationCap,
  Award,
  Menu,
  Compass,
  BookOpen,
  Eye,
} from "lucide-react"
import Link from "next/link"

const userProfile = {
  id: 1,
  name: "田中太郎",
  username: "@tanaka_career",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "未経験からエンジニアに転職 | 3年目 | React/Next.js | キャリアチェンジの経験をシェア",
  location: "東京, 日本",
  website: "https://tanaka-career.com",
  joinDate: "2022年3月",
  isPremium: true,
  isVerified: true,
  stats: {
    posts: 127,
    followers: 2340,
    following: 456,
    likes: 8920,
  },
  currentRole: "フロントエンドエンジニア",
  company: "株式会社テックイノベーション",
  experience: "3年",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "AWS", "Figma"],
}

const userPosts = [
  {
    id: 1,
    category: "成功体験",
    title: "未経験からエンジニア転職して3年が経ちました。",
    content:
      "当時の私は営業職で、プログラミングの「プ」の字も知らない状況でした。しかし、毎日コツコツと学習を続け、ついに念願のエンジニア転職を果たすことができました。",
    time: "2時間前",
    likes: 234,
    comments: 45,
    views: 1200,
    isLiked: false,
    tags: ["エンジニア転職", "未経験", "学習継続"],
  },
  {
    id: 2,
    category: "アドバイス",
    title: "転職活動で大切にした3つのポイント",
    content: "転職活動を通じて学んだのは、技術力だけでなく、コミュニケーション能力と学習意欲の重要性でした。",
    time: "1日前",
    likes: 189,
    comments: 32,
    views: 890,
    isLiked: true,
    tags: ["転職活動", "アドバイス"],
  },
  {
    id: 3,
    category: "失敗談",
    title: "初めてのコードレビューで指摘だらけだった話",
    content: "入社して初めてのコードレビューで、20個以上の指摘をもらいました。でもそれが成長のきっかけになりました。",
    time: "3日前",
    likes: 156,
    comments: 28,
    views: 654,
    isLiked: false,
    tags: ["失敗から学ぶ", "成長"],
  },
]

const careerTimeline = [
  {
    year: "2024",
    title: "シニアエンジニアに昇進",
    company: "株式会社テックイノベーション",
    description: "チームリーダーとして新人エンジニアの指導も担当",
    type: "promotion",
  },
  {
    year: "2022",
    title: "フロントエンドエンジニアとして転職",
    company: "株式会社テックイノベーション",
    description: "React/Next.jsを使った開発に従事",
    type: "job_change",
  },
  {
    year: "2021",
    title: "プログラミング学習開始",
    company: "独学・オンラインスクール",
    description: "営業職をしながら毎日2-3時間の学習を継続",
    type: "education",
  },
  {
    year: "2019",
    title: "営業職として入社",
    company: "株式会社セールスマスター",
    description: "BtoB営業として3年間勤務",
    type: "job_start",
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

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

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "promotion":
        return <Award className="w-5 h-5 text-emerald-500" />
      case "job_change":
        return <Building className="w-5 h-5 text-teal-500" />
      case "education":
        return <GraduationCap className="w-5 h-5 text-green-500" />
      case "job_start":
        return <Star className="w-5 h-5 text-lime-500" />
      default:
        return <Star className="w-5 h-5 text-gray-500" />
    }
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
              <Link href="/">
                <Button variant="ghost" className="gap-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50">
                  <Home className="w-4 h-4" />
                  ホーム
                </Button>
              </Link>
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
              <Avatar className="w-8 h-8 border-2 border-emerald-400">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
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
            {/* プロフィールヘッダー */}
            <Card className="mb-6 border-green-200 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 h-32 relative">
                <div className="absolute -bottom-12 left-6">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                      {userProfile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <CardContent className="pt-16 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-800">{userProfile.name}</h1>
                      {userProfile.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
                      {userProfile.isPremium && <Crown className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <p className="text-gray-500 mb-3">{userProfile.username}</p>
                    <p className="text-gray-700 mb-4 leading-relaxed">{userProfile.bio}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {userProfile.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {userProfile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        <a href={userProfile.website} className="text-emerald-500 hover:underline">
                          {userProfile.website}
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {userProfile.joinDate}に参加
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mb-6">
                      <div className="text-center">
                        <p className="font-bold text-xl text-gray-800">{userProfile.stats.posts}</p>
                        <p className="text-sm text-gray-500">投稿</p>
                      </div>
                      <div className="text-center cursor-pointer hover:bg-emerald-50 rounded-lg p-2 transition-colors">
                        <p className="font-bold text-xl text-gray-800">
                          {userProfile.stats.followers.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">フォロワー</p>
                      </div>
                      <div className="text-center cursor-pointer hover:bg-emerald-50 rounded-lg p-2 transition-colors">
                        <p className="font-bold text-xl text-gray-800">{userProfile.stats.following}</p>
                        <p className="text-sm text-gray-500">フォロー中</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-xl text-gray-800">{userProfile.stats.likes.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">いいね</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 hover:border-emerald-400 bg-transparent"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 hover:border-emerald-400 text-gray-600 bg-transparent"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      メッセージ
                    </Button>
                    <Button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={
                        isFollowing
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                      }
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isFollowing ? "フォロー中" : "フォローする"}
                    </Button>

                    <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 hover:border-emerald-400 text-gray-600 bg-transparent"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          編集
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>プロフィールを編集</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">名前</Label>
                            <Input id="name" defaultValue={userProfile.name} />
                          </div>
                          <div>
                            <Label htmlFor="bio">自己紹介</Label>
                            <Textarea id="bio" defaultValue={userProfile.bio} />
                          </div>
                          <div>
                            <Label htmlFor="location">場所</Label>
                            <Input id="location" defaultValue={userProfile.location} />
                          </div>
                          <div>
                            <Label htmlFor="website">ウェブサイト</Label>
                            <Input id="website" defaultValue={userProfile.website} />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                              キャンセル
                            </Button>
                            <Button
                              onClick={() => setIsEditingProfile(false)}
                              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                            >
                              保存
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* スキル表示 */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900 mb-3">スキル・技術</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* タブナビゲーション */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-green-200">
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
                >
                  投稿
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
                >
                  キャリア
                </TabsTrigger>
                <TabsTrigger
                  value="likes"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
                >
                  いいね
                </TabsTrigger>
              </TabsList>

              {/* 投稿タブ */}
              <TabsContent value="posts" className="mt-6">
                <div className="space-y-6">
                  {userPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="border-green-100 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="border-2 border-green-200">
                              <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800">{userProfile.name}</p>
                                {userProfile.isPremium && <Crown className="w-4 h-4 text-emerald-500" />}
                                <span className="text-gray-500">•</span>
                                <p className="text-sm text-gray-500">{post.time}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{userProfile.username}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {post.views}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getCategoryColor(post.category)} border`}>
                            {getCategoryIcon(post.category)}
                            <span className="ml-1">{post.category}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
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
                              <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                              {post.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {post.comments}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-gray-500 hover:text-green-500 hover:bg-green-50"
                            >
                              <Share className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-emerald-500 hover:bg-emerald-50"
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* キャリアタイムライン */}
              <TabsContent value="timeline" className="mt-6">
                <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                    <h3 className="font-semibold text-lg text-gray-800">キャリアタイムライン</h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {careerTimeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-white border-2 border-green-200 flex items-center justify-center shadow-sm">
                              {getTimelineIcon(item.type)}
                            </div>
                            {index < careerTimeline.length - 1 && <div className="w-0.5 h-16 bg-green-200 mt-2" />}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                {item.year}
                              </span>
                              <Badge variant="outline" className="text-xs border-green-200">
                                {item.type === "promotion" && "昇進"}
                                {item.type === "job_change" && "転職"}
                                {item.type === "education" && "学習"}
                                {item.type === "job_start" && "入社"}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{item.company}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* いいねタブ */}
              <TabsContent value="likes" className="mt-6">
                <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-600 mb-2">いいねした投稿</h3>
                    <p className="text-sm text-gray-500">いいねした投稿がここに表示されます</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右サイドバー */}
          <div className="space-y-6">
            {/* プロフィール統計 */}
            <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <h3 className="font-bold text-lg text-gray-800">プロフィール統計</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">プロフィール閲覧数</span>
                  <span className="font-semibold text-emerald-600">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">今月の投稿</span>
                  <span className="font-semibold text-teal-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平均いいね数</span>
                  <span className="font-semibold text-green-600">187</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">フォロワー増加率</span>
                  <span className="font-semibold text-emerald-600">+15%</span>
                </div>
              </CardContent>
            </Card>

            {/* プレミアム機能 */}
            {userProfile.isPremium && (
              <Card className="border-emerald-200 shadow-lg bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-emerald-800 mb-2">プレミアム会員</h3>
                    <div className="space-y-2 text-sm text-emerald-700 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>ダイレクトメッセージ無制限</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>詳細な統計情報</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>プレミアムバッジ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>優先サポート</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 関連するメンター */}
            <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                <h3 className="font-bold text-lg text-gray-800">関連するメンター</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-green-200">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>山</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">山田エンジニア</p>
                      <p className="text-sm text-gray-500">シニアエンジニア</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                  >
                    相談
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
