interface Props {
  params: { locale: string }
}

export default async function WorkIndexPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">
        {locale === 'en' ? 'Welcome to Work Projects' : 'Work Projectsへようこそ'}
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        {locale === 'en'
          ? 'Select a project from above to see its details.'
          : '下部のカードからプロジェクトを選択すると詳細が表示されます。'}
      </p>
      <div className="flex space-x-2 text-xs text-gray-400 mb-6">
        <span>Tip:</span>
        <span>
          {locale === 'en'
            ? 'Click a card to view demo'
            : 'カードをクリックしてデモを表示'}
        </span>
      </div>
      <hr className="w-full border-t border-gray-200 mt-auto" />
    </div>
  )
}
