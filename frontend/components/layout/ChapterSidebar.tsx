'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, BookOpen, FileText } from 'lucide-react';
import { Chapter } from '@/types';
import { contentService } from '@/lib/content';
import { cn } from '@/lib/utils';

interface ChapterSidebarProps {
  isOpen: boolean;
  currentChapter?: string;
}

export function ChapterSidebar({ isOpen, currentChapter }: ChapterSidebarProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const data = await contentService.getChapters();
      setChapters(data);
      
      // Auto-expand chapters containing current chapter
      if (currentChapter) {
        const expanded = new Set<string>();
        data.forEach(chapter => {
          if (chapter.children?.some(child => child.slug === currentChapter)) {
            expanded.add(chapter.id);
          }
        });
        setExpandedChapters(expanded);
      }
    } catch (error) {
      console.error('Failed to load chapters:', error);
    }
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const ChapterItem = ({ chapter, level = 0 }: { chapter: Chapter; level?: number }) => {
    const hasChildren = chapter.children && chapter.children.length > 0;
    const isExpanded = expandedChapters.has(chapter.id);
    const isActive = chapter.slug === currentChapter;

    return (
      <div>
        <div
          className={cn(
            'flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors',
            'hover:bg-gray-100',
            isActive && 'bg-blue-50 text-blue-700 border-r-2 border-blue-600',
            level > 0 && 'ml-4'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleChapter(chapter.id);
            } else {
              window.location.href = `/learn/${chapter.slug}`;
            }
          }}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 text-gray-400" />
            )
          ) : (
            <FileText className="h-4 w-4 mr-2 text-gray-400" />
          )}
          
          <span className={cn('flex-1', isActive && 'font-medium')}>
            {chapter.title}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {chapter.children!.map((child) => (
              <ChapterItem key={child.id} chapter={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out',
        'md:translate-x-0 md:static md:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'pt-16 md:pt-0'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {chapters.map((chapter) => (
            <ChapterItem key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
    </aside>
  );
}