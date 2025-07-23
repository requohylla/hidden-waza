'use client';
import React from 'react';

import { getProjects, ProjectCardProps } from '../../../../../data/projects';
import { ProjectCard } from '../../../../../components/ui/ProjectCard';

export default function ThreeDimensionalModelIndexLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; category?: string }>;
}) {
  const { locale, category } = React.use(params);
  const selectedCategory = category || '3dmodel';
  const projects = getProjects(locale).filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div>
        {children}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((proj) => (
          <ProjectCard key={proj.slug} {...proj} />
        ))}
      </div>
    </div>
  );
}
