'use client';

import React, { useState } from 'react';
import { Save, Eye, Code, Upload, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ContentEditorProps {
  initialContent?: {
    title: string;
    slug: string;
    description: string;
    content: string;
    published: boolean;
  };
  onSave: (content: any) => void;
}

export function ContentEditor({ initialContent, onSave }: ContentEditorProps) {
  const [formData, setFormData] = useState({
    title: initialContent?.title || '',
    slug: initialContent?.slug || '',
    description: initialContent?.description || '',
    content: initialContent?.content || '# New Chapter\n\nStart writing your content here...',
    published: initialContent?.published || false,
  });

  const [activeTab, setActiveTab] = useState('editor');

  const handleSave = () => {
    onSave(formData);
  };

  const insertCodeBlock = () => {
    const codeTemplate = '\n```javascript\n// Your code here\nconsole.log("Hello, World!");\n```\n';
    setFormData(prev => ({
      ...prev,
      content: prev.content + codeTemplate
    }));
  };

  const insertImage = () => {
    const imageTemplate = '\n![Alt text](https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg)\n';
    setFormData(prev => ({
      ...prev,
      content: prev.content + imageTemplate
    }));
  };

  const insertTable = () => {
    const tableTemplate = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |\n';
    setFormData(prev => ({
      ...prev,
      content: prev.content + tableTemplate
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content Editor</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked: any) => 
                setFormData(prev => ({ ...prev, published: checked }))
              }
            />
            <Label htmlFor="published">Published</Label>
          </div>
          <Button onClick={handleSave} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Chapter
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Chapter Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Chapter title"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="chapter-slug"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the chapter"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={insertCodeBlock}>
                <Code className="h-4 w-4 mr-2" />
                Code
              </Button>
              <Button variant="outline" size="sm" onClick={insertImage}>
                <Image className="h-4 w-4 mr-2" />
                Image
              </Button>
              <Button variant="outline" size="sm" onClick={insertTable}>
                <FileText className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-4">
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your content in Markdown..."
                className="min-h-[400px] font-mono text-sm"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <div className="border border-gray-200 rounded-lg p-6 min-h-[400px] bg-white">
                <div className="prose prose-lg max-w-none">
                  <h1>{formData.title}</h1>
                  <p className="text-gray-600">{formData.description}</p>
                  <div dangerouslySetInnerHTML={{ 
                    __html: formData.content.replace(/\n/g, '<br>') 
                  }} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}