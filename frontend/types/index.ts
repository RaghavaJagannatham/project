import { User } from '@/lib/auth';

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  parentId?: string;
  children?: Chapter[];
  content?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentSection {
  id: string;
  title: string;
  level: number;
  slug: string;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'chapter' | 'section';
  url: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}