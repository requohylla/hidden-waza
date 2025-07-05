'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const workProjects = ['validationcheck']; // 必要に応じて増やせます

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="projects-container">
      <aside className="projects-sidebar">
        <ul>
          {workProjects.map((slug) => (
            <li key={slug}>
              <Link
                href={`/projects/work/${slug}`}
                className={pathname === `/projects/work/${slug}` ? 'active' : ''}
              >
                {slug}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="projects-main">{children}</main>
    </div>
  );
}
