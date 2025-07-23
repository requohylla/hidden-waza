import fs from 'fs/promises'
import path from 'path'

/**
 * 指定したJSONファイルから key と locale を元に値を取得するユーティリティ関数
 *
 * 例:
 * categoryDescriptions.json:
 * {
 *   "work": {
 *     "ja": { "title": "Work Projectsへようこそ" },
 *     "en": { "title": "Welcome to Work Projects" }
 *   }
 * }
 *
 * getLocalizedJsonValue("data/projects/categoryDescriptions.json", "work", "ja")
 * => { "title": "Work Projectsへようこそ" }
 *
 * getLocalizedJsonValue("data/projects/categoryDescriptions.json", "work", "en")
 * => { "title": "Welcome to Work Projects" }
 */
export async function getLocalizedJsonValue(
  filePath: string,
  key: string,
  locale: string
): Promise<any> {
  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath)
  const json = await fs.readFile(absPath, 'utf-8')
  const data = JSON.parse(json)
  return data[key]?.[locale] ?? null
}

// 使用例:
// const result = await getLocalizedJsonValue(
//   "data/projects/categoryDescriptions.json",
//   "work",
//   "ja"
// )
// // result: { "title": "Work Projectsへようこそ" }