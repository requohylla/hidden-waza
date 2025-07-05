'use client';

import { ProjectCard, ProjectCardProps }  from '../../components/ui/ProjectCard';
import projectsData from '../../data/projects.json';

export default function ProjectsIndex() {
  const projects: ProjectCardProps[] = projectsData;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Projects</h1>
      <p className="text-gray-600 mb-6">
        ここでは技術デモ・ポートフォリオを一覧でご覧いただけます。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj) => (
          <ProjectCard key={proj.slug} {...proj} />
        ))}
      </div>
    </div>
  );
}
