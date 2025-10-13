import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
          description?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          category_id: string;
          image_url: string;
          features: any;
          specifications: any;
          is_featured: boolean;
          stock_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          category_id: string;
          image_url?: string;
          features?: any;
          specifications?: any;
          is_featured?: boolean;
          stock_status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          category_id?: string;
          image_url?: string;
          features?: any;
          specifications?: any;
          is_featured?: boolean;
          stock_status?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string;
          comment?: string;
          created_at?: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string;
          avatar_url: string;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          phone?: string;
          avatar_url?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string;
          avatar_url?: string;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
