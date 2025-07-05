// app/page.tsx
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function Home() {
  // サーバコンポーネント内で直接呼べる headers()
  const headersList = await headers()
  // 小文字化して先頭の言語コードだけ抜き出し
  const acceptLang = (headersList.get('accept-language') ?? '').toLowerCase()
  const preferred = acceptLang.split(',')[0].split('-')[0]

  // サポートするロケール
  const SUPPORTED = ['ja', 'en'] as const
  // サポート外なら英語にフォールバック
  const locale = SUPPORTED.includes(preferred as typeof SUPPORTED[number])
    ? preferred
    : 'en'

  return redirect(`/${locale}/projects`)
}
