import React from 'react';
import { LearnPageWrapper } from '@/components/learn/LearnPageWrapper';
import { Chapter, ContentSection } from '@/types';
import { contentService } from '@/lib/content';

export default async function ChapterPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  let chapter: Chapter | null = null;
  let sections: ContentSection[] = [];

  try {
    chapter = await contentService.getChapter(slug);
    
    if (chapter?.content) {
      sections = contentService.extractSections(chapter.content);
    }
  } catch (error) {
    console.error('Failed to load chapter:', error);
  }

  return <LearnPageWrapper chapter={chapter} sections={sections} slug={slug} />;
}