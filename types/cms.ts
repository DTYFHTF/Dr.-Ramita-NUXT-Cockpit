// CMS Page Types
export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  subtitle: string | null;
  type: 'terms' | 'privacy' | 'return' | 'shipping' | 'medical' | 'about' | 'faq' | 'custom';
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  is_active: boolean;
  last_updated: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface CMSPageResponse {
  success: boolean;
  data: CMSPage;
}

export interface CMSPagesListResponse {
  success: boolean;
  data: CMSPage[];
}
