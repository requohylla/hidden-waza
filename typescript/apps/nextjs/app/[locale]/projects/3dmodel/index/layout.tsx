'use client';

import { useParams } from 'next/navigation';
import { getProjects, ProjectCardProps } from '../../../../../data/projects';
import { ProjectCard } from '../../../../../components/ui/ProjectCard';

export default function WorkIndexLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useParams()!;
  const projects: ProjectCardProps[] = getProjects(locale);

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
