// components/ui/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { CodePreview } from './CodePreview';
import { getProjects, ProjectCardProps as BaseProps } from '../../data/projects';

// 利用可能なカテゴリ一覧。増えたらここに追加するだけでOK。
const CATEGORIES = ['work', 'chat'] as const;
type Category = typeof CATEGORIES[number];

export interface ProjectCardProps extends BaseProps {
  // slug, title, description は BaseProps に含まれる想定
}

export function ProjectCard({ slug, title, description, category }: ProjectCardProps) {
  // categoryプロパティを直接利用
  const href = category
    ? `/projects/${category}/${slug}`
    : `/projects`;
 
  return (
    <div className="flex flex-col justify-between p-6 bg-white border rounded-xl hover:shadow-lg transition-shadow">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500 mb-4">{description}</p>
        <CodePreview slug={slug} fetchPath={`/api/snippets/${slug}`} />
      </div>
      <Link
        href={href}
        className="mt-auto inline-block text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Live Demo →
      </Link>
    </div>
  );
}
