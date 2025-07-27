// API呼び出しモック実装（実際のAPIは別プロジェクトで実装予定）

export interface User {
  id: number
  name: string
  email: string
  joinDate: string
}

export interface Resume {
  id: number
  userId: number
  title: string
  description: string
  date: string
  skill: string
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

// モックデータ
const mockUser: User = {
  id: 1,
  name: '田中 太郎',
  email: 'tanaka@example.com',
  joinDate: '2024-01-15'
}

let mockResumes: Resume[] = [
  {
    id: 1,
    userId: 1,
    title: 'Reactを使用したECサイト開発',
    description: 'Next.js、TypeScript、Tailwind CSSを使用してモダンなECサイトを開発しました。決済機能、商品管理、ユーザー認証などの機能を実装し、レスポンシブデザインに対応しました。',
    date: '2024-03-15',
    skill: 'React',
    verified: true,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    title: 'Node.js API開発とデータベース設計',
    description: 'Express.jsとPostgreSQLを使用してRESTful APIを開発しました。JWT認証、バリデーション、エラーハンドリングを実装し、OpenAPIドキュメントも作成しました。',
    date: '2024-02-10',
    skill: 'Node.js',
    verified: false,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  }
]

// 遅延をシミュレート
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 認証API
export const authApi = {
  // ログイン
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(1000)
    
    // 簡単な認証チェック（実際にはバックエンドで実装）
    if (credentials.email === 'a@a' && credentials.password === 'a') {
      return {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now()
      }
    }
    
    throw new Error('認証に失敗しました')
  },

  // プロフィール取得
  async getProfile(): Promise<User> {
    await delay(500)
    return mockUser
  }
}

// 経歴書API
export const resumeApi = {
  // 経歴書一覧取得
  async getResumes(): Promise<Resume[]> {
    await delay(800)
    return [...mockResumes].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  // 経歴書作成
  async createResume(resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>): Promise<Resume> {
    await delay(1200)
    
    const newResume: Resume = {
      id: Math.max(...mockResumes.map(r => r.id), 0) + 1,
      userId: mockUser.id,
      ...resumeData,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockResumes.push(newResume)
    return newResume
  },

  // 経歴書更新
  async updateResume(id: number, resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>): Promise<Resume> {
    await delay(1000)
    
    const index = mockResumes.findIndex(r => r.id === id)
    if (index === -1) {
      throw new Error('経歴書が見つかりません')
    }
    
    const updatedResume: Resume = {
      ...mockResumes[index],
      ...resumeData,
      updatedAt: new Date().toISOString()
    }
    
    mockResumes[index] = updatedResume
    return updatedResume
  },

  // 経歴書削除
  async deleteResume(id: number): Promise<void> {
    await delay(800)
    
    const index = mockResumes.findIndex(r => r.id === id)
    if (index === -1) {
      throw new Error('経歴書が見つかりません')
    }
    
    mockResumes.splice(index, 1)
  }
}

// スキル一覧API
export const skillApi = {
  async getSkills(): Promise<string[]> {
    await delay(300)
    // 実際のAPIからスキル一覧を取得する想定
    return [
      'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
      'Node.js', 'Python', 'Java', 'C#', 'Go',
      'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB'
    ]
  }
}