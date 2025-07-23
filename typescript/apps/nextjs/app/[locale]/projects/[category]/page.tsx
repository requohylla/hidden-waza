import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string; category: string }
}

/*
    /ja/projects/[category] を直打ちされた場合は /ja/projects/[category]/index に遷移
*/
export default function CategoryIndexRedirect({ params }: Props) {
  redirect(`/${params.locale}/projects/${params.category}/index`)
}