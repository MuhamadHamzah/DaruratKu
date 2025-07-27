import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
        };
      };
      lost_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category_id: string;
          location: string;
          date_lost: string;
          image_url: string | null;
          contact_phone: string;
          reward_amount: number | null;
          status: 'lost' | 'found' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category_id: string;
          location: string;
          date_lost: string;
          image_url?: string | null;
          contact_phone: string;
          reward_amount?: number | null;
          status?: 'lost' | 'found' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category_id?: string;
          location?: string;
          date_lost?: string;
          image_url?: string | null;
          contact_phone?: string;
          reward_amount?: number | null;
          status?: 'lost' | 'found' | 'closed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};