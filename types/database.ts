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
      billing_customers: {
        Row: { user_id: string; stripe_customer_id: string; created_at: string; updated_at: string };
        Insert: { user_id: string; stripe_customer_id: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['billing_customers']['Insert']>;
        Relationships: [];
      };
      architecture_review_entitlements: {
        Row: {
          user_id: string; plan_key: string; stripe_subscription_id: string; stripe_price_id: string;
          stripe_status: string; cancel_at_period_end: boolean; current_period_start: string; current_period_end: string;
          sync_state: 'healthy' | 'degraded'; last_stripe_event_id: string | null; last_synced_at: string;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['architecture_review_entitlements']['Row'], 'last_stripe_event_id' | 'created_at' | 'updated_at'> & { last_stripe_event_id?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['architecture_review_entitlements']['Insert']>;
        Relationships: [];
      };
      architecture_review_usage_periods: {
        Row: { id: number; user_id: string; stripe_subscription_id: string; period_start: string; period_end: string; quota_limit_snapshot: number; consumed_count: number; reserved_count: number; created_at: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['architecture_review_usage_periods']['Row'], 'id' | 'consumed_count' | 'reserved_count' | 'created_at' | 'updated_at'> & { consumed_count?: number; reserved_count?: number; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['architecture_review_usage_periods']['Insert']>;
        Relationships: [];
      };
      architecture_review_usage_attempts: {
        Row: {
          request_id: string; user_id: string; usage_period_id: number; stripe_subscription_id: string;
          state: 'reserved' | 'consumed' | 'released'; provider_started_at: string | null; reservation_expires_at: string;
          provider_outcome: string | null; review_version: string | null; evidence_version: string | null;
          reviewer_version: string | null; provider_id: string | null; model_id: string | null;
          input_token_count: number | null; output_token_count: number | null; total_token_count: number | null;
          preflight_cost_estimate_micro_usd: number | null; post_call_cost_estimate_micro_usd: number | null;
          cost_profile_version: string | null; cost_estimate_status: 'estimated' | 'unknown' | null;
          failure_category: string | null; created_at: string; updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['architecture_review_usage_attempts']['Row']> & Pick<Database['public']['Tables']['architecture_review_usage_attempts']['Row'], 'request_id' | 'user_id' | 'usage_period_id' | 'stripe_subscription_id' | 'state' | 'reservation_expires_at'>;
        Update: Partial<Database['public']['Tables']['architecture_review_usage_attempts']['Row']>;
        Relationships: [];
      };
      stripe_webhook_events: {
        Row: { event_id: string; event_type: string; state: 'processing' | 'processed' | 'failed'; event_created_at: string; processed_at: string | null; failure_category: string | null; created_at: string; updated_at: string };
        Insert: Pick<Database['public']['Tables']['stripe_webhook_events']['Row'], 'event_id' | 'event_type' | 'state' | 'event_created_at'> & Partial<Database['public']['Tables']['stripe_webhook_events']['Row']>;
        Update: Partial<Database['public']['Tables']['stripe_webhook_events']['Row']>;
        Relationships: [];
      };
      architecture_review_billing_refresh_limits: {
        Row: { user_id: string; window_started_at: string; request_count: number; updated_at: string };
        Insert: { user_id: string; window_started_at: string; request_count?: number; updated_at?: string };
        Update: Partial<Database['public']['Tables']['architecture_review_billing_refresh_limits']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      reserve_architecture_review: {
        Args: { p_user_id: string; p_request_id: string; p_quota_limit: number; p_review_version: string; p_evidence_version: string; p_reviewer_version: string; p_provider_id: string; p_model_id: string; p_preflight_cost_estimate_micro_usd: number; p_cost_profile_version: string };
        Returns: Array<{ outcome: string; usage_period_id: number | null }>;
      };
      mark_architecture_review_provider_started: { Args: { p_user_id: string; p_request_id: string }; Returns: boolean };
      finalize_architecture_review_attempt: {
        Args: { p_user_id: string; p_request_id: string; p_terminal_state: string; p_provider_outcome: string; p_failure_category: string | null; p_input_tokens?: number | null; p_output_tokens?: number | null; p_total_tokens?: number | null; p_post_call_cost_estimate_micro_usd?: number | null; p_cost_estimate_status?: string | null };
        Returns: string;
      };
      cleanup_architecture_review_operational_metadata: { Args: { p_before?: string }; Returns: number };
      claim_architecture_review_billing_refresh: { Args: { p_user_id: string; p_window_seconds: number; p_request_limit: number }; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
