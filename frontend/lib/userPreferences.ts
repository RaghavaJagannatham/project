import { User } from '@/types';

export interface UserPreferences {
  likedChapters: string[];
  bookmarkedChapters: string[];
  completedChapters: string[];
  learningStreak: number;
  totalTimeSpent: number;
}

class UserPreferencesService {
  private getStorageKey(userId: string): string {
    return `user_preferences_${userId}`;
  }

  getUserPreferences(userId: string): UserPreferences {
    if (typeof window === 'undefined') {
      return this.getDefaultPreferences();
    }

    const stored = localStorage.getItem(this.getStorageKey(userId));
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      likedChapters: [],
      bookmarkedChapters: [],
      completedChapters: [],
      learningStreak: 0,
      totalTimeSpent: 0,
    };
  }

  updatePreferences(userId: string, preferences: Partial<UserPreferences>): void {
    const current = this.getUserPreferences(userId);
    const updated = { ...current, ...preferences };
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(updated));
  }

  toggleLike(userId: string, chapterId: string): boolean {
    const preferences = this.getUserPreferences(userId);
    const isLiked = preferences.likedChapters.includes(chapterId);
    
    if (isLiked) {
      preferences.likedChapters = preferences.likedChapters.filter(id => id !== chapterId);
    } else {
      preferences.likedChapters.push(chapterId);
    }
    
    this.updatePreferences(userId, preferences);
    return !isLiked;
  }

  toggleBookmark(userId: string, chapterId: string): boolean {
    const preferences = this.getUserPreferences(userId);
    const isBookmarked = preferences.bookmarkedChapters.includes(chapterId);
    
    if (isBookmarked) {
      preferences.bookmarkedChapters = preferences.bookmarkedChapters.filter(id => id !== chapterId);
    } else {
      preferences.bookmarkedChapters.push(chapterId);
    }
    
    this.updatePreferences(userId, preferences);
    return !isBookmarked;
  }

  markCompleted(userId: string, chapterId: string): void {
    const preferences = this.getUserPreferences(userId);
    if (!preferences.completedChapters.includes(chapterId)) {
      preferences.completedChapters.push(chapterId);
      this.updatePreferences(userId, preferences);
    }
  }
}

export const userPreferencesService = new UserPreferencesService();