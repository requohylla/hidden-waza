import { ProjectCard } from '../../../components/ui/ProjectCard'
import { getProjects } from '../../../data/projects'

interface Props {
  params: {
    locale: string
  }
}

export default async function ProjectsIndex({ params }: Props) {
  const { locale } = await params
  const projects = getProjects(locale)

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">
        {locale === 'en' ? 'Projects' : 'プロジェクト'}
      </h1>
      <p className="text-gray-600 mb-6">
        {locale === 'en'
          ? 'Here you can browse technical demos and portfolios.'
          : 'ここでは技術デモ・ポートフォリオを一覧でご覧いただけます。'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj) => (
          <ProjectCard key={proj.slug} {...proj} />
        ))}
      </div>
    </div>
  )
}
