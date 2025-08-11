export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
          skills: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          is_premium?: boolean
          is_verified?: boolean
          current_job_role?: string | null
          company?: string | null
          experience?: string | null
          skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          is_premium?: boolean
          is_verified?: boolean
          current_job_role?: string | null
          company?: string | null
          experience?: string | null
          skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: 'success' | 'failure' | 'advice'
          tags: string[] | null
          career_level: string | null
          career_stage: string | null
          read_time: number | null
          likes_count: number
          comments_count: number
          views_count: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: 'success' | 'failure' | 'advice'
          tags?: string[] | null
          career_level?: string | null
          career_stage?: string | null
          read_time?: number | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: 'success' | 'failure' | 'advice'
          tags?: string[] | null
          career_level?: string | null
          career_stage?: string | null
          read_time?: number | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          is_read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'like' | 'comment' | 'follow' | 'message'
          title: string
          message: string
          is_read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'like' | 'comment' | 'follow' | 'message'
          title: string
          message: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'like' | 'comment' | 'follow' | 'message'
          title?: string
          message?: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}