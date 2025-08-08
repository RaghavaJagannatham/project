'use client';

import React from 'react';
import { CodeBlock } from './CodeBlock';

const mdxComponents = {
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-gray-700 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-4 bg-blue-50 py-2 rounded-r" {...props}>
      <div className="text-blue-900">{children}</div>
    </blockquote>
  ),
  code: ({ children, className, ...props }: any) => {
    const language = className?.replace('language-', '') || 'text';
    
    if (typeof children === 'string' && children.includes('\n')) {
      return (
        <CodeBlock language={language} {...props}>
          {children}
        </CodeBlock>
      );
    }
    
    return (
      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: any) => {
    return <div {...props}>{children}</div>;
  },
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-200" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" {...props}>
      {children}
    </td>
  ),
};

interface MDXContentProps {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
}

export function MDXContent({ content, components = {} }: MDXContentProps) {
  const allComponents = { ...mdxComponents, ...components };
  
  // In a real app, you'd use MDX compilation here
  // For now, we'll render the content as HTML with proper styling
  return (
    <div className="prose prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}