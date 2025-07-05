export const dynamicParams = false
export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ locale: 'ja' }, { locale: 'en' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params

  return (
    <>
      {/* 必要ならここでコンテキストやヘッダー設定 */}
      {children}
    </>
  )
}
