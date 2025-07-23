import { notFound } from 'next/navigation';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateStaticParams() {
  const base = path.join(process.cwd(), 'projects', '3dmodel');
  const names = await fs.readdir(base);
  return names.map((slug) => ({ slug }));
}

export default async function Project3DModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const Component = (await import(`../../../../../projects/3dmodel/${slug}/app`)).default;
    return <Component />;
  } catch {
    return notFound();
  }
}