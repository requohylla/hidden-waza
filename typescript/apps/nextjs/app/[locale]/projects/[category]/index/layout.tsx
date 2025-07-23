'use client';
import React from 'react';
import { ProjectCardList } from '../../../../../components/ui/ProjectCardList';

export default function CategoryIndexLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = React.use(params);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div>
        {children}
      </div>
      <ProjectCardList locale={locale} category={category} />
    </div>
  );
}