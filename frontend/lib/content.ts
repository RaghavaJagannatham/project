// import { Chapter, ContentSection } from '@/types';

// // Mock content data - replace with API calls in production
// export const mockChapters: Chapter[] = [
//   {
//     id: '1',
//     title: 'Introduction to Programming',
//     slug: 'introduction-programming',
//     description: 'Learn the fundamentals of programming',
//     order: 1,
//     published: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     children: [
//       {
//         id: '1-1',
//         title: 'What is Programming?',
//         slug: 'what-is-programming',
//         order: 1,
//         parentId: '1',
//         published: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         id: '1-2',
//         title: 'Programming Languages',
//         slug: 'programming-languages',
//         order: 2,
//         parentId: '1',
//         published: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ],
//   },
//   {
//     id: '2',
//     title: 'JavaScript Fundamentals',
//     slug: 'javascript-fundamentals',
//     description: 'Master JavaScript basics',
//     order: 2,
//     published: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     children: [
//       {
//         id: '2-1',
//         title: 'Variables and Data Types',
//         slug: 'variables-data-types',
//         order: 1,
//         parentId: '2',
//         published: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         id: '2-2',
//         title: 'Functions',
//         slug: 'functions',
//         order: 2,
//         parentId: '2',
//         published: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ],
//   },
// ];

// export class ContentService {
//   async getChapters(): Promise<Chapter[]> {
//     // Mock API call
//     return mockChapters;
//   }

//   async getChapter(slug: string): Promise<Chapter | null> {
//     // Flatten all chapters and find by slug
//     const allChapters = this.flattenChapters(mockChapters);
//     return allChapters.find(chapter => chapter.slug === slug) || null;
//   }

//   async searchContent(query: string): Promise<any[]> {
//     const allChapters = this.flattenChapters(mockChapters);
//     return allChapters
//       .filter(chapter => 
//         chapter.title.toLowerCase().includes(query.toLowerCase()) ||
//         chapter.description?.toLowerCase().includes(query.toLowerCase())
//       )
//       .map(chapter => ({
//         id: chapter.id,
//         title: chapter.title,
//         excerpt: chapter.description || '',
//         type: 'chapter',
//         url: `/learn/${chapter.slug}`,
//       }));
//   }

//   private flattenChapters(chapters: Chapter[]): Chapter[] {
//     const result: Chapter[] = [];
//     for (const chapter of chapters) {
//       result.push(chapter);
//       if (chapter.children) {
//         result.push(...this.flattenChapters(chapter.children));
//       }
//     }
//     return result;
//   }

//   extractSections(content: string): ContentSection[] {
//     // Extract headings from MDX content
//     const headingRegex = /^(#{1,6})\s+(.+)$/gm;
//     const sections: ContentSection[] = [];
//     let match;

//     while ((match = headingRegex.exec(content)) !== null) {
//       const level = match[1].length;
//       const title = match[2].trim();
//       const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
//       sections.push({
//         id: `section-${sections.length}`,
//         title,
//         level,
//         slug,
//       });
//     }

//     return sections;
//   }
// }

// export const contentService = new ContentService();






// /frontend/lib/content.ts
import { apiFetch } from "./api";

export type Chapter = { id: number; title: string; order: number };
export type Page = { id: number; title: string; content: string; order: number; status: string };

export const contentApi = {
  listChapters: (): Promise<Chapter[]> =>
    apiFetch(`/api/content/chapters`, { method: "GET" }),

  createChapter: (payload: { title: string; order?: number }) =>
    apiFetch(`/api/content/chapters`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateChapter: (id: number, payload: Partial<Chapter>) =>
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

  // ---- Simple client-side search over chapters/pages ----
  searchContent: async (q: string) => {
    const query = q.toLowerCase();
    const chapters = await contentApi.listChapters();

    // fetch all pages for each chapter (you can optimize later)
    const allPages: Array<{
      chapter: Chapter;
      page: Page;
    }> = [];

    for (const ch of chapters) {
      try {
        const pages = await contentApi.listPages(ch.id);
        for (const p of pages) {
          allPages.push({ chapter: ch, page: p });
        }
      } catch {
        // ignore chapter fetch errors
      }
    }

    // basic filter by title/content
    const matches = allPages
      .map(({ chapter, page }) => {
        const hay = `${page.title} ${page.content}`.toLowerCase();
        if (!hay.includes(query)) return null;

        // create a URL for your app (adjust if your route differs)
        // If you have a real slug, use it here. Otherwise derive one.
        const slugFromTitle = (s: string) =>
          s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        const chapterSlug = slugFromTitle(chapter.title || `chapter-${chapter.id}`);
        const pageSlug = slugFromTitle(page.title || `page-${page.id}`);

        // Example route: /learn/[slug]
        const url = `/learn/${pageSlug}`;

        // crude excerpt
        const i = hay.indexOf(query);
        const excerpt =
          i >= 0
            ? (page.content || "").slice(Math.max(0, i - 40), i + 60)
            : (page.content || "").slice(0, 100);

        return {
          id: `${chapter.id}-${page.id}`,
          title: `${chapter.title} • ${page.title}`,
          url,
          excerpt,
        };
      })
      .filter(Boolean) as Array<{ id: string; title: string; url: string; excerpt: string }>;

    return matches.slice(0, 20);
  },
};

// Backward-compat name
export const contentService = contentApi;
export default contentApi;
