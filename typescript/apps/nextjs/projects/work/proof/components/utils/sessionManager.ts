// セッション管理ユーティリティ

export interface SessionData {
  user: {
    id: number
    name: string
    email: string
    joinDate: string
  }
  token: string
  loginTime: number
  expiresAt: number
}

export interface FormData {
  title: string
  description: string
  date: string
  skills: {
    items: {
      type: 'os' | 'tools' | 'languages'
      master_id: number
      name: string
    }[]
  }
}

const SESSION_KEY = 'resume_app_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24時間

export class SessionManager {
  // セッションを保存
  static saveSession(user: SessionData['user'], token: string): void {
    const now = Date.now()
    const sessionData: SessionData = {
      user,
      token,
      loginTime: now,
      expiresAt: now + SESSION_DURATION
    }
    
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.warn('セッション保存に失敗:', error)
    }
  }
  
  // セッションを取得
  static getSession(): SessionData | null {
    try {
      const sessionString = sessionStorage.getItem(SESSION_KEY)
      if (!sessionString) return null
      
      const sessionData: SessionData = JSON.parse(sessionString)
      
      // 有効期限チェック
      if (Date.now() > sessionData.expiresAt) {
        this.clearSession()
        return null
      }
      
      return sessionData
    } catch (error) {
      console.warn('セッション取得に失敗:', error)
      this.clearSession()
      return null
    }
  }
  
  // セッションの有効性確認
  static isValidSession(): boolean {
    const session = this.getSession()
    return session !== null
  }
  
  // セッションをクリア
  static clearSession(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.warn('セッション削除に失敗:', error)
    }
  }
  
  // セッション残り時間を取得（分単位）
  static getRemainingTime(): number {
    const session = this.getSession()
    if (!session) return 0
    
    const remaining = session.expiresAt - Date.now()
    return Math.max(0, Math.floor(remaining / (60 * 1000)))
  }
  
  // セッション延長
  static extendSession(): boolean {
    const session = this.getSession()
    if (!session) return false
    
    session.expiresAt = Date.now() + SESSION_DURATION
    
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      return true
    } catch (error) {
      console.warn('セッション延長に失敗:', error)
      return false
    }
  }
  
  // ユーザー情報を取得
  static getCurrentUser() {
    const session = this.getSession()
    return session?.user || null
  }
  
  // トークンを取得
  static getToken(): string | null {
    const session = this.getSession()
    return session?.token || null
  }

  // フォームデータ保存
  static saveFormData(formData: FormData, formType: 'create' | 'edit'): void {
    try {
      const key = `resume_form_${formType}`
      sessionStorage.setItem(key, JSON.stringify(formData))
    } catch (error) {
      console.warn('フォームデータ保存に失敗:', error)
    }
  }

  // フォームデータ取得
  static getFormData(formType: 'create' | 'edit'): FormData | null {
    try {
      const key = `resume_form_${formType}`
      const data = sessionStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.warn('フォームデータ取得に失敗:', error)
      return null
    }
  }

  // フォームデータクリア
  static clearFormData(formType: 'create' | 'edit'): void {
    try {
      const key = `resume_form_${formType}`
      sessionStorage.removeItem(key)
    } catch (error) {
      console.warn('フォームデータクリアに失敗:', error)
    }
  }

  // 現在のビューを保存
  static saveCurrentView(view: string): void {
    try {
      sessionStorage.setItem('resume_current_view', view)
    } catch (error) {
      console.warn('ビュー保存に失敗:', error)
    }
  }

  // 現在のビューを取得
  static getCurrentView(): string | null {
    try {
      return sessionStorage.getItem('resume_current_view')
    } catch (error) {
      console.warn('ビュー取得に失敗:', error)
      return null
    }
  }
}