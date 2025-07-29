import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

/*
    /ja/projects/workを直打ちされた場合はindexに遷移
*/
export default async function WorkIndexRedirect({ params }: Props) {
  const resolvedParams = await params
  redirect(`/${resolvedParams.locale}/projects/work/index`)
}
