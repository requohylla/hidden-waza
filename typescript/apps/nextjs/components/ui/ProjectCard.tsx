'use client';

import Link from 'next/link';
import { CodePreview } from './CodePreview';

export interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
}

export function ProjectCard({ slug, title, description }: ProjectCardProps) {
  return (
    <div className="flex flex-col justify-between p-6 bg-white border rounded-xl hover:shadow-lg transition-shadow">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500 mb-4">{description}</p>
        <CodePreview slug={slug} fetchPath={`/api/snippets/${slug}`} />
      </div>
      <Link
        href={`/projects/work/${slug}`}
        className="mt-auto inline-block text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Live Demo →
      </Link>
    </div>
  );
}
