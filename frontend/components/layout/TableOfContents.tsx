'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { ContentSection } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TableOfContentsProps {
  sections: ContentSection[];
  activeSection?: string;
}

export function TableOfContents({ sections, activeSection }: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const scrollToSection = useCallback((slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  if (sections.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block fixed right-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-l border-gray-200">
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <List className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-sm font-semibold text-gray-900">Table of Contents</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.slug)}
                  className={cn(
                    'w-full text-left px-2 py-1 text-sm rounded transition-colors',
                    'hover:bg-gray-100 hover:text-gray-900',
                    activeSection === section.slug
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600',
                    section.level === 1 && 'font-medium',
                    section.level === 2 && 'ml-3',
                    section.level === 3 && 'ml-6',
                    section.level >= 4 && 'ml-9'
                  )}
                  style={{
                    paddingLeft: `${8 + (section.level - 1) * 12}px`
                  }}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}