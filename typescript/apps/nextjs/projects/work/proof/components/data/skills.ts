// カテゴリー別スキルマスターデータ
export const SKILLS_BY_CATEGORY = {
  os: [
    'Windows',
    'macOS',
    'Linux (Ubuntu)',
    'Linux (CentOS)',
    'Linux (Red Hat)',
    'UNIX',
    'iOS',
    'Android'
  ],
  tools: [
    'Visual Studio Code',
    'IntelliJ IDEA',
    'Eclipse',
    'Xcode',
    'Android Studio',
    'Git',
    'GitHub',
    'GitLab',
    'Bitbucket',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'CircleCI',
    'GitHub Actions',
    'Terraform',
    'Ansible',
    'AWS CLI',
    'Azure CLI',
    'Google Cloud CLI',
    'Postman',
    'Swagger',
    'Figma',
    'Adobe XD',
    'Photoshop',
    'Illustrator',
    'Slack',
    'Microsoft Teams',
    'Jira',
    'Confluence',
    'Notion',
    'Trello'
  ],
  languages: [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C#',
    'C++',
    'C',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
    'Dart',
    'Scala',
    'HTML',
    'CSS',
    'SQL',
    'React',
    'Vue.js',
    'Angular',
    'Next.js',
    'Nuxt.js',
    'Express.js',
    'Django',
    'Flask',
    'Spring Boot',
    'ASP.NET',
    'Laravel',
    'Ruby on Rails',
    'Flutter',
    'React Native',
    'Node.js',
    'Tailwind CSS',
    'Bootstrap',
    'Sass/SCSS',
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Elasticsearch',
    'Oracle',
    'SQL Server',
    'AWS',
    'Azure',
    'Google Cloud',
    'Firebase'
  ]
} as const

export type SkillCategory = keyof typeof SKILLS_BY_CATEGORY

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  os: 'OS',
  tools: 'ツール',
  languages: '言語・フレームワーク'
}

export function getSkillsByCategory(category: SkillCategory): string[] {
  return [...SKILLS_BY_CATEGORY[category]].sort()
}

export function getAllCategories(): SkillCategory[] {
  return Object.keys(SKILLS_BY_CATEGORY) as SkillCategory[]
}

// 後方互換性のため
export function getSkills(): string[] {
  return Object.values(SKILLS_BY_CATEGORY).flat().sort()
}