'use client';

import React, { useState } from 'react';
import { Copy, Check, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  copyProtected?: boolean;
}

export function CodeBlock({ 
  children, 
  language = 'javascript', 
  filename,
  copyProtected = true 
}: CodeBlockProps) {
  const { hasPermission } = useAuth();
  const [copied, setCopied] = useState(false);
  const canCopy = hasPermission('copy_code');

  const handleCopy = async () => {
    if (!canCopy && copyProtected) return;

    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    if (!canCopy && copyProtected) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <div className="relative group">
      {filename && (
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200 rounded-t-lg">
          <span className="text-sm font-medium text-gray-700">{filename}</span>
          <span className="text-xs text-gray-500 uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <pre
          className={cn(
            'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto',
            filename ? 'rounded-t-none' : 'rounded-lg',
            !canCopy && copyProtected && 'select-none user-select-none'
          )}
          onMouseDown={handleSelect}
          style={{
            userSelect: (!canCopy && copyProtected) ? 'none' : 'text',
            WebkitUserSelect: (!canCopy && copyProtected) ? 'none' : 'text',
            MozUserSelect: (!canCopy && copyProtected) ? 'none' : 'text',
            msUserSelect: (!canCopy && copyProtected) ? 'none' : 'text',
          }}
        >
          <code className="text-sm">{children}</code>
        </pre>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {copyProtected && !canCopy ? (
            <div className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Login to copy
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="h-7 w-7 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}