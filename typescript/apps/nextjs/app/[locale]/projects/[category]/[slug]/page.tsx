import type { ReactElement } from "react";
import { notFound } from 'next/navigation';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateStaticParams({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  if (!category) return [];
  const base = path.join(process.cwd(), 'projects', category);
  const names = await fs.readdir(base);
  return names.map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function CategoryProjectPage({ params }: PageProps): Promise<ReactElement> {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  const slug = resolvedParams.slug;

  try {
    const Component = (await import(`../../../../../projects/${category}/${slug}/app`)).default;
    return <Component />;
  } catch {
    return notFound();
  }
}