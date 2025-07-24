'use client';
import { ReactNode, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  StarIcon as StarOutline,
  StarIcon as StarSolid,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const TAGS = ['React', 'Validation', 'Next.js', 'TypeScript', 'Demo'];

type Project = {
  slug: string;
  title: string;
  isFavorite: boolean;
};

const sampleProjects: Project[] = [
  { slug: 'demo1', title: 'Demo Project 1', isFavorite: true },
  { slug: 'demo2', title: 'Demo Project 2', isFavorite: false },
  { slug: 'demo3', title: 'Demo Project 3', isFavorite: true },
];

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop() || '';
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // pathnameからlocaleを取得（SSR安全）
  const locale = pathname.split('/')[1] || 'en';

  // 多言語対応（SSR安全）
  const texts = {
    ja: {
      myPortfolio: 'マイポートフォリオ',
      searchPlaceholder: 'プロジェクトを検索…',
      favorites: 'お気に入り',
      tags: 'タグ'
    },
    en: {
      myPortfolio: 'MyPortfolio',
      searchPlaceholder: 'Search projects…',
      favorites: 'Favorites',
      tags: 'Tags'
    }
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  const filteredProjects = useMemo(() => {
    return sampleProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) &&
        (selectedTags.length === 0 ||
          selectedTags.some((tag) => p.title.includes(tag)))
    );
  }, [query, selectedTags]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* PC: サイドバー領域常時確保（表示ボタンは出さない） */}
      <div className="hidden md:flex h-full w-72 flex-shrink-0">
        {isSidebarVisible ? (
          <aside className="w-72 border-r bg-white p-6 flex flex-col relative">
            <button
              className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              onClick={() => setIsSidebarVisible(false)}
              aria-label="サイドバー非表示"
            >
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </button>
            <Link href="/" className="text-2xl font-extrabold mb-8" suppressHydrationWarning>
              {t.myPortfolio}
            </Link>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div className="mb-6">
              <h2 className="flex items-center text-sm font-semibold mb-2" suppressHydrationWarning>
                <StarOutline className="w-4 h-4 mr-1 text-yellow-500" />
                {t.favorites}
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
              <h2 className="text-sm font-semibold mb-2" suppressHydrationWarning>{t.tags}</h2>
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
        ) : (
          <div className="w-72"></div>
        )}
      </div>
      {/* スマホ: スライドサイドバー＋オーバーレイ */}
      <button
        className="fixed top-4 left-4 z-20 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition md:hidden"
        onClick={() => setIsSidebarVisible(true)}
        aria-label="サイドバー表示"
        style={{ display: isSidebarVisible ? 'none' : 'block' }}
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r shadow-lg z-30 flex flex-col p-6 transition-transform duration-300 md:hidden ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-80'
        }`}
      >
        <button
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          onClick={() => setIsSidebarVisible(false)}
          aria-label="サイドバー非表示"
        >
          <XMarkIcon className="w-6 h-6 text-gray-700" />
        </button>
        <Link href="/" className="text-2xl font-extrabold mb-8" suppressHydrationWarning>
          {t.myPortfolio}
        </Link>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring"
            suppressHydrationWarning
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div className="mb-6">
          <h2 className="flex items-center text-sm font-semibold mb-2" suppressHydrationWarning>
            <StarOutline className="w-4 h-4 mr-1 text-yellow-500" />
            {t.favorites}
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
          <h2 className="text-sm font-semibold mb-2" suppressHydrationWarning>{t.tags}</h2>
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
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
