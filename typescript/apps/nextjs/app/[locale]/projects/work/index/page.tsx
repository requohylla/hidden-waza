import fs from 'fs/promises'
import path from 'path'

interface Props {
  params: { locale: string }
}

async function getWorkDescription(locale: string) {
  const filePath = path.join(process.cwd(), 'data', 'projects', 'categoryDescriptions.json')
  const json = await fs.readFile(filePath, 'utf-8')
  const descriptions = JSON.parse(json)
  return descriptions.work?.[locale] ?? { title: 'Work Projects', description: '', tip: '' }
}

async function getCommonTip(locale: string) {
  const filePath = path.join(process.cwd(), 'data', 'projects', 'commonDescriptions.json')
  const json = await fs.readFile(filePath, 'utf-8')
  const tips = JSON.parse(json)
  return tips.tip?.[locale] ?? ''
}

export default async function WorkIndexPage({ params }: Props) {
  const { locale } = params
  const { title, description } = await getWorkDescription(locale)
  const tip = await getCommonTip(locale)

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">
        {title}
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      <div className="flex space-x-2 text-xs text-gray-400 mb-6">
        <span>{tip}</span>
      </div>
      <hr className="w-full border-t border-gray-200 mt-auto" />
    </div>
  )
}
