'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LOCALES = ['ja', 'en'] as const;

export function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const segments = pathname.split('/');
  // URL の先頭が /ja/... or /en/... になっている想定
  const current = LOCALES.includes(segments[1] as any)
    ? (segments[1] as typeof LOCALES[number])
    : 'ja';
  // ロケール部分を取り除いたパス
  const rest = '/' + segments.slice(2).join('/');

  return (
    <div className="flex space-x-2">
      {LOCALES.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${rest}`}
          className={`px-2 py-1 rounded ${
            loc === current
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {loc === 'ja' ? '日本語' : 'English'}
        </Link>
      ))}
    </div>
  );
}
