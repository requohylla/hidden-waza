'use client';
import React from 'react';

import { getProjects } from '../../../../../data/projects';
import { ProjectCardList } from '../../../../../components/ui/ProjectCardList';

export default function WorkIndexLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; category?: string }>;
}) {
  const { locale, category } = React.use(params);
  const selectedCategory = category || 'work';

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div>
        {children}
      </div>
      <ProjectCardList locale={locale} category={selectedCategory} />
    </div>
  );
}
