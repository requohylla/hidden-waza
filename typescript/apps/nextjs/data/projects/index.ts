import common from './common.json'
import ja from './locales/ja.json'
import en from './locales/en.json'

const localeData = { ja, en } as const
type Locale = keyof typeof localeData

type CategoryCommon = { description?: string }
type ItemCommon = { description?: string }
type CommonItem = { slug: string; common?: ItemCommon }
type CommonJson = Record<string, { common?: CategoryCommon; items: CommonItem[] }>
type LocaleJson = Record<string, { slug: string; title: string; description: string }[]>
const commonData = common as CommonJson
const localeDataTyped = { ja: ja as LocaleJson, en: en as LocaleJson }
export type ProjectCommon = { slug: string; category: string }
export type ProjectText = {
  slug: string
  title: string
  description: string
}
export type ProjectCardProps = ProjectCommon & ProjectText & {
  categoryCommon?: { description?: string }
  itemCommon?: { description?: string }
}

/** locale に応じて common + texts をマージした配列を返す（category付き） */
export function getProjects(locale: string): ProjectCardProps[] {
  const textsByCategory = localeDataTyped[locale as Locale] ?? localeDataTyped.ja
  const result: ProjectCardProps[] = []
  for (const category of Object.keys(commonData)) {
    const categoryCommon = commonData[category].common ?? {}
    const items = commonData[category].items
    const texts = textsByCategory[category] ?? []
    for (const c of items) {
      const t = texts.find(x => x.slug === c.slug)
      if (t) {
        result.push({
          ...c,
          ...t,
          category,
          categoryCommon: categoryCommon,
          itemCommon: c.common ?? {}
        })
      }
    }
  }
  return result
}
export function getProjectsByCategory(locale: string): Record<string, { categoryCommon?: { description?: string }, items: ProjectCardProps[] }> {
  const textsByCategory = localeDataTyped[locale as Locale] ?? localeDataTyped.ja
  const result: Record<string, { categoryCommon?: { description?: string }, items: ProjectCardProps[] }> = {}
  for (const category of Object.keys(commonData)) {
    const categoryCommon = commonData[category].common ?? {}
    const items = commonData[category].items
    const texts = textsByCategory[category] ?? []
    const mergedItems: ProjectCardProps[] = []
    for (const c of items) {
      const t = texts.find(x => x.slug === c.slug)
      if (t) {
        mergedItems.push({
          ...c,
          ...t,
          category,
          itemCommon: c.common ?? {}
        })
      }
    }
    result[category] = {
      categoryCommon: categoryCommon,
      items: mergedItems
    }
  }
  return result
}
