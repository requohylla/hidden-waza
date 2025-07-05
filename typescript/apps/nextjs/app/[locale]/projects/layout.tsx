'use client';
import { ReactNode, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  StarIcon as StarOutline,
  StarIcon as StarSolid,
} from '@heroicons/react/24/outline';

const TAGS = ['React', 'Validation', 'Next.js', 'TypeScript', 'Demo'];

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop() || '';
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // クエリとタグでフィルタリング（サンプルデータは省略）
  const filteredProjects = useMemo(() => {
    // 実際にはContextやAPIから取得したプロジェクト配列をフィルタ
    return []; 
  }, [query, selectedTags]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-72 border-r bg-white p-6 flex flex-col">
        <Link href="/" className="text-2xl font-extrabold mb-8">
          MyPortfolio
        </Link>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search projects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="mb-6">
          <h2 className="flex items-center text-sm font-semibold mb-2">
            <StarOutline className="w-4 h-4 mr-1 text-yellow-500" />
            Favorites
          </h2>
          <ul className="space-y-1 text-sm">
            {filteredProjects
              .filter((p) => p.isFavorite)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/work/${p.slug}`}
                    className={`flex justify-between items-center hover:underline ${
                      p.slug === currentSlug ? 'font-bold text-blue-600' : ''
                    }`}
                  >
                    {p.title}
                    {p.slug === currentSlug ? (
                      <StarSolid className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <StarOutline className="w-4 h-4 opacity-50" />
                    )}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
