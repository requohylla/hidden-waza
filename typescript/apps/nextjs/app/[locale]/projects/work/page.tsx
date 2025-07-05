import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string }
}

/*
    /ja/projects/workを直打ちされた場合はindexに遷移
*/
export default function WorkIndexRedirect({ params }: Props) {
  redirect(`/${params.locale}/projects/work/index`)
}
