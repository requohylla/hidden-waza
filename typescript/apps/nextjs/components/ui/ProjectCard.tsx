// components/ui/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { CodePreview } from './CodePreview';
import { getProjects, ProjectCardProps as BaseProps } from '../../data/projects';

export interface ProjectCardProps extends BaseProps {
  // slug, title, description は BaseProps に含まれる想定
}

export function ProjectCard(props: ProjectCardProps) {
  // propeからプロパティを抽出
  const { slug, title, description, category } = props;
  const href = category
    ? `/projects/${category}/${slug}`
    : `/projects`;

  return (
    <div className="flex flex-col justify-between p-6 bg-white border rounded-xl hover:shadow-lg transition-shadow sm:p-6 p-3">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-base">{title}</h2>
        <p className="text-gray-500 mb-4 text-sm">{description}</p>
        <CodePreview slug={slug} fetchPath={`/api/snippets/${category}/${slug}`} />
      </div>
      <Link
        href={href}
        className="mt-auto inline-block text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
      >
        Live Demo →
      </Link>
    </div>
  );
}
