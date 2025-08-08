import { contentService } from '@/lib/content';

export async function generateStaticParams() {
  const chapters = await contentService.getChapters();
  const allChapters = [];
  
  // Flatten all chapters including nested ones
  function flattenChapters(chapters: any[]) {
    for (const chapter of chapters) {
      allChapters.push({ slug: chapter.slug });
      if (chapter.children) {
        flattenChapters(chapter.children);
      }
    }
  }
  
  flattenChapters(chapters);
  return allChapters;
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}