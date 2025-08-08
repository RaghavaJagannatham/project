'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  BookOpen, 
  TrendingUp,
  Settings,
  Shield,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  // Mock data for demonstration
  const stats = [
    { title: 'Total Chapters', value: '24', icon: BookOpen, change: '+12%' },
    { title: 'Active Users', value: '1,249', icon: Users, change: '+8%' },
    { title: 'Completion Rate', value: '87%', icon: TrendingUp, change: '+3%' },
    { title: 'System Health', value: '99.9%', icon: Activity, change: '0%' },
  ];

  const recentContent = [
    { id: 1, title: 'Introduction to React', status: 'published', updated: '2 hours ago', views: 245 },
    { id: 2, title: 'JavaScript Fundamentals', status: 'draft', updated: '1 day ago', views: 189 },
    { id: 3, title: 'CSS Grid Layout', status: 'published', updated: '3 days ago', views: 167 },
    { id: 4, title: 'Node.js Basics', status: 'review', updated: '1 week ago', views: 298 },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active', joined: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'inactive', joined: '2024-01-20' },
  ];

  useEffect(() => {
    console.log('user:', user);
  }, [user]);


  useEffect(() => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    // Allow access but show limited functionality for non-admin users
  }, [user, hasPermission]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowEditor(false)}
                className="mb-4"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <ContentEditor
              initialContent={selectedContent}
              onSave={(content) => {
                console.log('Saving content:', content);
                setShowEditor(false);
                setSelectedContent(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {hasPermission('manage_users') ? 'Admin Dashboard' : 'Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {hasPermission('manage_users') 
                ? 'Manage your educational content and users' 
                : 'View your learning analytics and progress'}
            </p>
            {!hasPermission('manage_users') && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Limited access: Some admin features require elevated permissions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">{stat.change}</span>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className={`grid w-full ${hasPermission('manage_users') ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              {hasPermission('manage_users') && (
                <TabsTrigger value="users">User Management</TabsTrigger>
              )}
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Content Management
                    </CardTitle>
                    <Button onClick={() => setShowEditor(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {hasPermission('manage_users') ? 'New Chapter' : 'View Content'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentContent.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>Updated {item.updated}</span>
                            <span>•</span>
                            <span>{item.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedContent(item);
                              setShowEditor(true);
                            }}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {hasPermission('manage_users') && (
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getRoleColor(user.role)}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {user.joined}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Platform Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Site Title
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue="EduPlatform"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Default Language
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Require 2FA for all admin users</p>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Code Copy Protection</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Restrict code copying to logged-in users</p>
                          </div>
                          <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}