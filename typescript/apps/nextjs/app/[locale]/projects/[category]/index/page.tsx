import { getLocalizedJsonValue } from "@/lib/getLocalizedJsonValue"

interface Props {
  params: { locale: string; category: string }
}

import { notFound } from 'next/navigation'

export default async function CategoryIndexPage({ params }: Props) {
  const { locale, category } = params
  const categoryDesc = await getLocalizedJsonValue(
    "data/projects/categoryDescriptions.json",
    category,
    locale
  )
  // カテゴリが存在しない場合は404
  if (!categoryDesc) {
    notFound()
  }
  const tip = await getLocalizedJsonValue(
    "data/projects/commonDescriptions.json",
    "tip",
    locale
  )

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">
        {categoryDesc?.title}
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        {categoryDesc?.description}
      </p>
      <div className="flex space-x-2 text-xs text-gray-400 mb-6">
        <span>{tip}</span>
      </div>
      <hr className="w-full border-t border-gray-200 mt-auto" />
    </div>
  )
}