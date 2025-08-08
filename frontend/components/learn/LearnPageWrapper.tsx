'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { ChapterSidebar } from '@/components/layout/ChapterSidebar';
import { TableOfContents } from '@/components/layout/TableOfContents';
import { CodeBlock } from '@/components/content/CodeBlock';
import { Chapter, ContentSection } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, User, Heart, Bookmark, CheckCircle } from 'lucide-react';
import { userPreferencesService } from '@/lib/userPreferences';

interface LearnPageWrapperProps {
  chapter: Chapter | null;
  sections: ContentSection[];
  slug: string;
}

export function LearnPageWrapper({ chapter, sections, slug }: LearnPageWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  React.useEffect(() => {
    if (user && chapter) {
      const preferences = userPreferencesService.getUserPreferences(user.id);
      setIsLiked(preferences.likedChapters.includes(chapter.id));
      setIsBookmarked(preferences.bookmarkedChapters.includes(chapter.id));
      setIsCompleted(preferences.completedChapters.includes(chapter.id));
    }
  }, [user, chapter]);

  const handleLike = () => {
    if (!user || !chapter) return;
    const newLikedState = userPreferencesService.toggleLike(user.id, chapter.id);
    setIsLiked(newLikedState);
  };

  const handleBookmark = () => {
    if (!user || !chapter) return;
    const newBookmarkedState = userPreferencesService.toggleBookmark(user.id, chapter.id);
    setIsBookmarked(newBookmarkedState);
  };

  const handleMarkCompleted = () => {
    if (!user || !chapter) return;
    userPreferencesService.markCompleted(user.id, chapter.id);
    setIsCompleted(true);
  };

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <ChapterSidebar isOpen={sidebarOpen} currentChapter={slug} />
          <main className="flex-1 md:ml-64 xl:mr-64 p-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chapter Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400">The requested chapter could not be found.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <ChapterSidebar isOpen={sidebarOpen} currentChapter={slug} />
        
        <main className="flex-1 md:ml-64 xl:mr-64">
          <article className="max-w-4xl mx-auto px-6 py-8">
            {/* Chapter Header */}
            <header className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <BookOpen className="h-4 w-4" />
                <span>Course Material</span>
                <span>•</span>
                <span>Chapter {chapter.order}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {chapter.title}
              </h1>
              
              {chapter.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  {chapter.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>15 min read</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Beginner Level</span>
                  </div>
                  <Badge variant="secondary">Programming</Badge>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="space-y-8">
                {/* Introduction */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                      Introduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      Welcome to this comprehensive chapter on {chapter.title}. In this section, you'll learn the fundamental concepts and practical applications that will help you master this topic.
                    </p>
                  </CardContent>
                </Card>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 id="getting-started" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Before we dive into the details, let's understand the basic concepts and build a solid foundation.
                  </p>

                  <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Concept 1</strong>: Understanding the fundamentals</li>
                    <li><strong>Concept 2</strong>: Practical applications</li>
                    <li><strong>Concept 3</strong>: Best practices and patterns</li>
                  </ul>

                  <h2 id="code-examples" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">Code Examples</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Here's a basic example to get you started:</p>

                  <CodeBlock language="javascript" filename="example.js">
{`// Basic JavaScript example
function greetUser(name) {
  return \`Hello, \${name}! Welcome to the course.\`;
}

const message = greetUser("Student");
console.log(message);`}
                  </CodeBlock>

                  <h3 id="advanced-example" className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">Advanced Example</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">For more advanced users, here's a complex example:</p>

                  <CodeBlock language="javascript" filename="advanced.js" copyProtected={true}>
{`class LearningManager {
  constructor(courseName) {
    this.courseName = courseName;
    this.students = [];
    this.progress = new Map();
  }

  enrollStudent(student) {
    this.students.push(student);
    this.progress.set(student.id, 0);
  }

  updateProgress(studentId, completedLessons) {
    this.progress.set(studentId, completedLessons);
  }

  getOverallProgress() {
    const totalProgress = Array.from(this.progress.values())
      .reduce((sum, progress) => sum + progress, 0);
    return totalProgress / this.students.length;
  }
}`}
                  </CodeBlock>

                  <h2 id="interactive-elements" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">Interactive Elements</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Here's a table showing different programming concepts:</p>

                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Concept</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Difficulty</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time to Learn</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prerequisites</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Variables</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Beginner</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1 hour</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">None</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Functions</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Beginner</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2 hours</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Variables</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Objects</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Intermediate</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">4 hours</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Functions</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Classes</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Intermediate</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">6 hours</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Objects</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2 id="key-takeaways" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">Key Takeaways</h2>
                  
                  <blockquote className="border-l-4 border-blue-500 pl-4 my-6 bg-blue-50 dark:bg-blue-900/20 py-4 rounded-r">
                    <div className="text-blue-900 dark:text-blue-100">
                      <strong>Important</strong>: Remember that learning programming is a journey. Take your time to understand each concept thoroughly before moving to the next one.
                    </div>
                  </blockquote>

                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">What you've learned:</h3>
                  <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Basic syntax and structure</li>
                    <li>Core programming concepts</li>
                    <li>Best practices for writing clean code</li>
                    <li>How to debug and troubleshoot common issues</li>
                  </ol>

                  <h2 id="next-steps" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">Next Steps</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Now that you've completed this chapter, you're ready to move on to more advanced topics. Consider reviewing the concepts again if needed, and practice with the provided exercises.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </main>

        <TableOfContents 
          sections={[
            { id: '1', title: 'Getting Started', level: 2, slug: 'getting-started' },
            { id: '2', title: 'Code Examples', level: 2, slug: 'code-examples' },
            { id: '3', title: 'Advanced Example', level: 3, slug: 'advanced-example' },
            { id: '4', title: 'Interactive Elements', level: 2, slug: 'interactive-elements' },
            { id: '5', title: 'Key Takeaways', level: 2, slug: 'key-takeaways' },
            { id: '6', title: 'Next Steps', level: 2, slug: 'next-steps' },
          ]}
        />
      </div>
    </div>
  );
}