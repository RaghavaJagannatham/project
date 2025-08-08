'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Heart, 
  Bookmark, 
  CheckCircle, 
  Clock, 
  Trophy,
  TrendingUp,
  BookOpen,
  Calendar,
  Target
} from 'lucide-react';
import { userPreferencesService, UserPreferences } from '@/lib/userPreferences';
import { contentService } from '@/lib/content';

export default function ProfilePage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [likedChapters, setLikedChapters] = useState<any[]>([]);
  const [bookmarkedChapters, setBookmarkedChapters] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const userPrefs = userPreferencesService.getUserPreferences(user.id);
    setPreferences(userPrefs);

    // Load chapter details for liked and bookmarked items
    const chapters = await contentService.getChapters();
    const allChapters = flattenChapters(chapters);

    const liked = allChapters.filter(chapter => userPrefs.likedChapters.includes(chapter.id));
    const bookmarked = allChapters.filter(chapter => userPrefs.bookmarkedChapters.includes(chapter.id));

    setLikedChapters(liked);
    setBookmarkedChapters(bookmarked);
  };

  const flattenChapters = (chapters: any[]): any[] => {
    const result: any[] = [];
    for (const chapter of chapters) {
      result.push(chapter);
      if (chapter.children) {
        result.push(...flattenChapters(chapter.children));
      }
    }
    return result;
  };

  const handleRemoveLike = (chapterId: string) => {
    if (!user) return;
    userPreferencesService.toggleLike(user.id, chapterId);
    setLikedChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
  };

  const handleRemoveBookmark = (chapterId: string) => {
    if (!user) return;
    userPreferencesService.toggleBookmark(user.id, chapterId);
    setBookmarkedChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
  };

  if (!user || !preferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const completionRate = Math.round((preferences.completedChapters.length / 10) * 100); // Assuming 10 total chapters

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <Badge className="mt-2" variant={user.role === 'admin' ? 'destructive' : 'default'}>
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{preferences.completedChapters.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Liked</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{preferences.likedChapters.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bookmarked</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{preferences.bookmarkedChapters.length}</p>
                  </div>
                  <Bookmark className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{preferences.learningStreak}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Overall Completion</span>
                    <span className="font-medium text-gray-900 dark:text-white">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Time Spent: </span>
                    <span className="font-medium text-gray-900 dark:text-white">{preferences.totalTimeSpent}h</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Joined: </span>
                    <span className="font-medium text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="liked" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="liked">Liked Chapters</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="liked">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Liked Chapters ({likedChapters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {likedChapters.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No liked chapters yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Start exploring and like chapters you enjoy!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {likedChapters.map((chapter) => (
                      <div key={chapter.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{chapter.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{chapter.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/learn/${chapter.slug}`}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLike(chapter.id)}
                          >
                            <Heart className="h-4 w-4 text-red-600 fill-current" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarked">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bookmark className="h-5 w-5 mr-2 text-blue-600" />
                  Bookmarked Chapters ({bookmarkedChapters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookmarkedChapters.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No bookmarked chapters yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Bookmark chapters to read later!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookmarkedChapters.map((chapter) => (
                      <div key={chapter.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{chapter.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{chapter.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/learn/${chapter.slug}`}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBookmark(chapter.id)}
                          >
                            <Bookmark className="h-4 w-4 text-blue-600 fill-current" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Completed Chapters ({preferences.completedChapters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {preferences.completedChapters.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No completed chapters yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Start learning to track your progress!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {preferences.completedChapters.map((chapterId, index) => (
                      <div key={chapterId} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Chapter {index + 1} Completed</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}