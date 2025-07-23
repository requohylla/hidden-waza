interface Props {
  params: { locale: string; }
}

export default async function ThreeDimensionalModelIndexPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">
        {locale === 'en' ? '3D Model Projects' : '3Dモデル関連プロジェクト'}
      </h1>

      <p className="text-gray-600 mb-6 max-w-md">
        {locale === 'en'
          ? 'Explore and manage various 3D model-related features from below.'
          : '下の一覧から、3Dモデルに関連するさまざまな機能を確認・操作できます。'}
      </p>

      <div className="flex space-x-2 text-xs text-gray-400 mb-6">
        <span>{locale === 'en' ? 'Tip:' : 'ヒント:'}</span>
        <span>
          {locale === 'en'
            ? 'Click a card to explore details or start working with a project.'
            : 'カードをクリックすると、詳細の確認や操作を開始できます。'}
        </span>
      </div>
      <hr className="w-full border-t border-gray-200 mt-auto" />
    </div>
  )
}
