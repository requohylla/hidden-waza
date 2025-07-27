// スキルマスターデータ
export const SKILLS = [
  // プログラミング言語
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  
  // フロントエンド
  'React',
  'Vue.js',
  'Angular',
  'Next.js',
  'Nuxt.js',
  'HTML/CSS',
  'Tailwind CSS',
  'Bootstrap',
  'Sass/SCSS',
  
  // バックエンド
  'Node.js',
  'Express.js',
  'Django',
  'Flask',
  'Spring Boot',
  'ASP.NET',
  'Laravel',
  'Ruby on Rails',
  
  // データベース
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Elasticsearch',
  'Oracle',
  'SQL Server',
  
  // クラウド・インフラ
  'AWS',
  'Azure',
  'Google Cloud',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Ansible',
  
  // その他
  'Git',
  'CI/CD',
  'API設計',
  'データベース設計',
  'セキュリティ',
  'テスト自動化',
  'アジャイル開発',
  'プロジェクトマネジメント'
]

export function getSkills(): string[] {
  return SKILLS.sort()
}