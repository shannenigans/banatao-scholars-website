export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      email_whitelist: {
        Row: {
          email: string
          isAdmin: boolean
        }
        Insert: {
          email: string
          isAdmin?: boolean
        }
        Update: {
          email?: string
          isAdmin?: boolean
        }
        Relationships: []
      }
      events: {
        Row: {
          description: string | null
          ends_on: string | null
          id: string
          location: string | null
          member_only: boolean
          published_at: string | null
          starts_on: string
          status: string
          title: string
          url: string | null
        }
        Insert: {
          description?: string | null
          ends_on?: string | null
          id?: string
          location?: string | null
          member_only?: boolean
          published_at?: string | null
          starts_on: string
          status?: string
          title: string
          url?: string | null
        }
        Update: {
          description?: string | null
          ends_on?: string | null
          id?: string
          location?: string | null
          member_only?: boolean
          published_at?: string | null
          starts_on?: string
          status?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          bucket_path: string | null
          cover_image: string | null
          description: string | null
          event_date: string | null
          slug: string
          status: string
          title: string
        }
        Insert: {
          bucket_path?: string | null
          cover_image?: string | null
          description?: string | null
          event_date?: string | null
          slug: string
          status?: string
          title: string
        }
        Update: {
          bucket_path?: string | null
          cover_image?: string | null
          description?: string | null
          event_date?: string | null
          slug?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          company: string
          description: string | null
          expires_at: string | null
          id: string
          location: string | null
          posted_at: string
          posted_by: string | null
          posted_by_user_id: string
          remote: boolean
          title: string
          type: string
          url: string
        }
        Insert: {
          company: string
          description?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          posted_at?: string
          posted_by?: string | null
          posted_by_user_id: string
          remote?: boolean
          title: string
          type: string
          url: string
        }
        Update: {
          company?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          posted_at?: string
          posted_by?: string | null
          posted_by_user_id?: string
          remote?: boolean
          title?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      mentorship_signups: {
        Row: {
          areas: string[]
          bio: string | null
          created_at: string
          id: string
          role: string
          user_email: string
          user_id: string
        }
        Insert: {
          areas?: string[]
          bio?: string | null
          created_at?: string
          id?: string
          role: string
          user_email: string
          user_id: string
        }
        Update: {
          areas?: string[]
          bio?: string | null
          created_at?: string
          id?: string
          role?: string
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          body: string | null
          category: string
          cover_image: string | null
          excerpt: string
          featured: boolean
          published_at: string | null
          scholar_id: number | null
          slug: string
          status: string
          title: string
        }
        Insert: {
          author?: string | null
          body?: string | null
          category: string
          cover_image?: string | null
          excerpt: string
          featured?: boolean
          published_at?: string | null
          scholar_id?: number | null
          slug: string
          status?: string
          title: string
        }
        Update: {
          author?: string | null
          body?: string | null
          category?: string
          cover_image?: string | null
          excerpt?: string
          featured?: boolean
          published_at?: string | null
          scholar_id?: number | null
          slug?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "public_scholars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "scholar_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "scholars"
            referencedColumns: ["id"]
          },
        ]
      }
      scholars: {
        Row: {
          bio: string | null
          cellPhone: string | null
          company: string | null
          currentAddress: string | null
          currentCity: string | null
          currentPhone: string | null
          currentState: string | null
          currentZip: string | null
          description: string | null
          email: string | null
          first: string | null
          homeAddress: string | null
          homeCity: string | null
          homePhone: string | null
          homeState: string | null
          homeZip: string | null
          id: number
          imageUrl: string | null
          last: string | null
          major: string | null
          middle: string | null
          oldEmails: string | null
          parents: string | null
          parentsContact: string | null
          school: string | null
          schoolAddress: string | null
          schoolAddress2: string | null
          schoolCity: string | null
          schoolPhone: string | null
          schoolState: string | null
          schoolZip: string | null
          status: string | null
          year: string | null
        }
        Insert: {
          bio?: string | null
          cellPhone?: string | null
          company?: string | null
          currentAddress?: string | null
          currentCity?: string | null
          currentPhone?: string | null
          currentState?: string | null
          currentZip?: string | null
          description?: string | null
          email?: string | null
          first?: string | null
          homeAddress?: string | null
          homeCity?: string | null
          homePhone?: string | null
          homeState?: string | null
          homeZip?: string | null
          id?: number
          imageUrl?: string | null
          last?: string | null
          major?: string | null
          middle?: string | null
          oldEmails?: string | null
          parents?: string | null
          parentsContact?: string | null
          school?: string | null
          schoolAddress?: string | null
          schoolAddress2?: string | null
          schoolCity?: string | null
          schoolPhone?: string | null
          schoolState?: string | null
          schoolZip?: string | null
          status?: string | null
          year?: string | null
        }
        Update: {
          bio?: string | null
          cellPhone?: string | null
          company?: string | null
          currentAddress?: string | null
          currentCity?: string | null
          currentPhone?: string | null
          currentState?: string | null
          currentZip?: string | null
          description?: string | null
          email?: string | null
          first?: string | null
          homeAddress?: string | null
          homeCity?: string | null
          homePhone?: string | null
          homeState?: string | null
          homeZip?: string | null
          id?: number
          imageUrl?: string | null
          last?: string | null
          major?: string | null
          middle?: string | null
          oldEmails?: string | null
          parents?: string | null
          parentsContact?: string | null
          school?: string | null
          schoolAddress?: string | null
          schoolAddress2?: string | null
          schoolCity?: string | null
          schoolPhone?: string | null
          schoolState?: string | null
          schoolZip?: string | null
          status?: string | null
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_scholars: {
        Row: {
          bio: string | null
          company: string | null
          currentCity: string | null
          currentState: string | null
          description: string | null
          first: string | null
          id: number | null
          imageUrl: string | null
          last: string | null
          major: string | null
          middle: string | null
          school: string | null
          status: string | null
          year: string | null
        }
        Insert: {
          bio?: string | null
          company?: string | null
          currentCity?: string | null
          currentState?: string | null
          description?: string | null
          first?: string | null
          id?: number | null
          imageUrl?: string | null
          last?: string | null
          major?: string | null
          middle?: string | null
          school?: string | null
          status?: string | null
          year?: string | null
        }
        Update: {
          bio?: string | null
          company?: string | null
          currentCity?: string | null
          currentState?: string | null
          description?: string | null
          first?: string | null
          id?: number | null
          imageUrl?: string | null
          last?: string | null
          major?: string | null
          middle?: string | null
          school?: string | null
          status?: string | null
          year?: string | null
        }
        Relationships: []
      }
      scholar_contacts: {
        Row: {
          cellPhone: string | null
          email: string | null
          id: number | null
        }
        Insert: {
          cellPhone?: string | null
          email?: string | null
          id?: number | null
        }
        Update: {
          cellPhone?: string | null
          email?: string | null
          id?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_whitelisted: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
