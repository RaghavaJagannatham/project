'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ChapterSidebar } from '@/components/layout/ChapterSidebar';
import { TableOfContents } from '@/components/layout/TableOfContents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: 'Rich Content',
      description: 'Interactive lessons with code examples, images, and multimedia content'
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Learn together with peers and get help from instructors'
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking'
    },
    {
      icon: TrendingUp,
      title: 'Skill Development',
      description: 'Build real-world skills with hands-on projects and exercises'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <ChapterSidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 md:ml-64 xl:mr-64">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-blue-600">EduPlatform</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                A comprehensive learning management system designed for modern education. 
                Learn programming, explore interactive content, and track your progress.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" onClick={() => window.location.href = '/learn/introduction-programming'}>
                  Start Learning
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/auth/login'}>
                  Sign In
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Demo Section */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl">Try Our Interactive Learning Experience</CardTitle>
                <CardDescription>
                  Experience our three-panel layout with chapter navigation, main content, and table of contents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Click on any chapter in the sidebar to see the full learning interface in action
                  </p>
                  <Button onClick={() => window.location.href = '/learn/javascript-fundamentals'}>
                    View Sample Chapter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admin Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Content Management</CardTitle>
                <CardDescription>
                  For administrators: Manage content with our powerful editing tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Access the admin dashboard to create and manage educational content
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                    Admin Dashboard Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <TableOfContents sections={[]} />
      </div>
    </div>
  );
}