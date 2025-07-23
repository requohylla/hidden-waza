import { notFound } from 'next/navigation';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateStaticParams({ params }: { params: { category: string } }) {
  const category = params.category;
  if (!category) return [];
  const base = path.join(process.cwd(), 'projects', category);
  const names = await fs.readdir(base);
  return names.map((slug) => ({ slug }));
}

export default async function CategoryProjectPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  try {
    const Component = (await import(`../../../../../projects/${category}/${slug}/app`)).default;
    return <Component />;
  } catch {
    return notFound();
  }
}