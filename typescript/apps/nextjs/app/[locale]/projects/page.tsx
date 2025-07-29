import { ProjectCardList } from '../../../components/ui/ProjectCardList'
import { getProjects } from '../../../data/projects'

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function ProjectsIndex({ params }: Props) {
  const { locale } = await params
  const projects = Object.values(getProjects(locale)).flatMap(v => v.items)

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
      <ProjectCardList locale={locale} />
    </div>
  )
}
