import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

// Client Component
import ResponsiveProjectPage from '@/components/ui/ResponsiveProjectPage';

export async function generateStaticParams() {
  const base = path.join(process.cwd(), 'projects', 'work');
  const names = await fs.readdir(base);
  return names.map((slug) => ({ slug }));
}

// サーバーコンポーネント
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const projectDir = path.join(process.cwd(), 'projects', 'work', slug);

  let markdown: string;
  try {
    markdown = await fs.readFile(path.join(projectDir, 'README.md'), 'utf-8');
  } catch {
    return notFound();
  }

  const Demo = (await import(`../../../../../projects/work/${slug}/Demo`)).default;

  // Client Componentへprops渡し
  return <ResponsiveProjectPage markdown={markdown} Demo={Demo} />;
}
