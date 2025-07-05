'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CodeBracketIcon, XMarkIcon } from '@heroicons/react/24/outline';

type CodePreviewProps = {
  slug: string;
  fetchPath: string;  // e.g. `/api/snippets/${slug}`
};

export function CodePreview({ slug, fetchPath }: CodePreviewProps) {
  const [snippet, setSnippet] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Escapeキーでモーダル閉じる
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // スニペットをロード
  useEffect(() => {
    // 絶対 URL を組み立て
    const url = `${window.location.origin}${fetchPath}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load snippet: ${slug}`);
        return res.text();
      })
      .then((code) => setSnippet(code.trim()))
      .catch((err) => {
        console.warn(err);
        setSnippet('');
      });
  }, [fetchPath, slug]);

  const firstLine = snippet.split('\n')[0] || '';

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm text-gray-600 truncate">{firstLine}</span>
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 rounded hover:bg-gray-100"
          aria-label="View full snippet"
        >
          <CodeBracketIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Full Code Snippet</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-[80vh]">
              <code>{snippet}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
