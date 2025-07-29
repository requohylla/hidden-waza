import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; category: string }>
}

/*
    /ja/projects/[category] を直打ちされた場合は /ja/projects/[category]/index に遷移
*/
export default async function CategoryIndexRedirect({ params }: Props) {
  const resolvedParams = await params
  redirect(`/${resolvedParams.locale}/projects/${resolvedParams.category}/index`)
}