// /frontend/lib/content.ts
import { apiFetch } from "./api";

export type Chapter = { 
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
};

export type Page = { 
  id: number; 
  title: string; 
  content: string; 
  order: number; 
  status: string; 
};

export type ContentSection = {
  id: string;
  title: string;
  level: number;
  slug: string;
};

// Mock data for demo purposes since backend doesn't have full chapter structure yet
const mockChapters: Chapter[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    slug: 'introduction-programming',
    description: 'Learn the fundamentals of programming',
    order: 1,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '1-1',
        title: 'What is Programming?',
        slug: 'what-is-programming',
        order: 1,
        parentId: '1',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '1-2',
        title: 'Programming Languages',
        slug: 'programming-languages',
        order: 2,
        parentId: '1',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    slug: 'javascript-fundamentals',
    description: 'Master JavaScript basics',
    order: 2,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: '2-1',
        title: 'Variables and Data Types',
        slug: 'variables-data-types',
        order: 1,
        parentId: '2',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2-2',
        title: 'Functions',
        slug: 'functions',
        order: 2,
        parentId: '2',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];

export const contentApi = {
  // Use mock data for now, but keep API structure for future backend integration
  async getChapters(): Promise<Chapter[]> {
    try {
      // Try to get from backend first, fall back to mock data
      const backendChapters = await apiFetch(`/api/content/chapters`, { method: "GET" });
      // Transform backend data to frontend format if needed
      return mockChapters; // For now, use mock data
    } catch {
      return mockChapters;
    }
  },

  async getChapter(slug: string): Promise<Chapter | null> {
    const allChapters = this.flattenChapters(mockChapters);
    return allChapters.find(chapter => chapter.slug === slug) || null;
  },

  flattenChapters(chapters: Chapter[]): Chapter[] {
    const result: Chapter[] = [];
    for (const chapter of chapters) {
      result.push(chapter);
      if (chapter.children) {
        result.push(...this.flattenChapters(chapter.children));
      }
    }
    return result;
  },

  extractSections(content: string): ContentSection[] {
    // Extract headings from content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const sections: ContentSection[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      sections.push({
        id: `section-${sections.length}`,
        title,
        level,
        slug,
      });
    }

    return sections;
  },

  async searchContent(query: string): Promise<any[]> {
    const allChapters = this.flattenChapters(mockChapters);
    return allChapters
      .filter(chapter => 
        chapter.title.toLowerCase().includes(query.toLowerCase()) ||
        chapter.description?.toLowerCase().includes(query.toLowerCase())
      )
      .map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        excerpt: chapter.description || '',
        type: 'chapter',
        url: `/learn/${chapter.slug}`,
      }));
  },

  // Backend API methods (for future use)
  listChapters: (): Promise<any[]> =>
    apiFetch(`/api/content/chapters`, { method: "GET" }),

  createChapter: (payload: { title: string; order?: number }) =>
    apiFetch(`/api/content/chapters`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateChapter: (id: number, payload: any) =>
    apiFetch(`/api/content/chapters/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteChapter: (id: number) =>
    apiFetch(`/api/content/chapters/${id}`, { method: "DELETE" }),

  listPages: (chapterId: number): Promise<Page[]> =>
    apiFetch(`/api/content/chapters/${chapterId}/pages`, { method: "GET" }),

  createPage: (
    chapterId: number,
    payload: { title: string; content: string; order?: number; status?: string }
  ) =>
    apiFetch(`/api/content/chapters/${chapterId}/pages`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updatePage: (pageId: number, payload: Partial<Page>) =>
    apiFetch(`/api/content/pages/${pageId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deletePage: (pageId: number) =>
    apiFetch(`/api/content/pages/${pageId}`, { method: "DELETE" }),
};

// Backward-compat name
export const contentService = contentApi;
export default contentApi;