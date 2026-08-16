export interface Database {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string;
          title: string;
          title_en: string | null;
          title_ja: string | null;
          description: string;
          description_en: string | null;
          description_ja: string | null;
          category: string | null;
          preview_nodes_count: { agents: number; tasks: number; tools: number } | null;
          graph_data: Database['public']['Tables']['templates']['Insert']['graph_data'];
        };
        Insert: {
          id: string;
          title: string;
          title_en?: string | null;
          title_ja?: string | null;
          description: string;
          description_en?: string | null;
          description_ja?: string | null;
          category?: string | null;
          preview_nodes_count?: { agents: number; tasks: number; tools: number } | null;
          graph_data: import('@/types/editor').GraphData;
        };
        Update: Partial<Database['public']['Tables']['templates']['Insert']>;
        Relationships: [];
      };
      purchases: {
        Row: {
          stripe_session_id: string;
          template_id: string | null;
          amount: number | null;
          customer_email: string | null;
          created_at: string;
        };
        Insert: {
          stripe_session_id: string;
          template_id?: string | null;
          amount?: number | null;
          customer_email?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['purchases']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
