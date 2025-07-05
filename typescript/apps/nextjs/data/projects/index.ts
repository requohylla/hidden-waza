import common from './common.json'
import ja from './locales/ja.json'
import en from './locales/en.json'

const localeData = { ja, en } as const
type Locale = keyof typeof localeData

export type ProjectCommon = typeof common[number]
export type ProjectText = typeof ja[number]
export type ProjectCardProps = ProjectCommon & ProjectText

/** locale に応じて common + texts をマージした配列を返す */
export function getProjects(locale: string): ProjectCardProps[] {
  const texts = localeData[locale as Locale] ?? localeData.ja
  return common.map(c => {
    const t = texts.find(x => x.slug === c.slug)!
    return { ...c, ...t }
  })
}
