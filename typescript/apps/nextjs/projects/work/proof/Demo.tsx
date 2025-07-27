// 職務経歴書デモ（本格版）
// ログイン → プロフィール → 経歴書作成・編集の完全なフロー

'use client'

import { useState, useEffect } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { ResumeFormScreen } from './components/ResumeFormScreen'
import { Navigation } from './components/ui/Navigation'
import { authApi, resumeApi, skillApi, User, Resume } from './components/api/mockApi'
import { getSkills } from './components/data/skills'

type View = 'login' | 'profile' | 'create' | 'edit'

interface AppState {
  currentView: View
  user: User | null
  resumes: Resume[]
  skills: string[]
  editingResume: Resume | null
  isLoading: boolean
}

export default function Demo() {
  const [state, setState] = useState<AppState>({
    currentView: 'login',
    user: null,
    resumes: [],
    skills: [],
    editingResume: null,
    isLoading: false
  })

  // 初期化：スキル一覧を取得
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skills = getSkills()
        setState(prev => ({ ...prev, skills }))
      } catch (error) {
        console.error('スキル読み込みエラー:', error)
      }
    }
    loadSkills()
  }, [])

  // ログイン処理
  const handleLogin = async (credentials: { email: string; password: string }) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const { user } = await authApi.login(credentials)
      const resumes = await resumeApi.getResumes()
      
      setState(prev => ({
        ...prev,
        user,
        resumes,
        currentView: 'profile',
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  // ナビゲーション処理
  const handleNavigate = (view: 'profile' | 'create' | 'logout') => {
    if (view === 'logout') {
      setState({
        currentView: 'login',
        user: null,
        resumes: [],
        skills: state.skills,
        editingResume: null,
        isLoading: false
      })
    } else {
      setState(prev => ({
        ...prev,
        currentView: view,
        editingResume: null
      }))
    }
  }

  // 経歴書作成処理
  const handleCreateResume = async (resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const newResume = await resumeApi.createResume(resumeData)
      const updatedResumes = await resumeApi.getResumes()
      
      setState(prev => ({
        ...prev,
        resumes: updatedResumes,
        currentView: 'profile',
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  // 経歴書編集処理
  const handleEditResume = (resumeId: number) => {
    const resume = state.resumes.find(r => r.id === resumeId)
    if (resume) {
      setState(prev => ({
        ...prev,
        editingResume: resume,
        currentView: 'edit'
      }))
    }
  }

  // 経歴書更新処理
  const handleUpdateResume = async (resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) => {
    if (!state.editingResume) return
    
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      await resumeApi.updateResume(state.editingResume.id, resumeData)
      const updatedResumes = await resumeApi.getResumes()
      
      setState(prev => ({
        ...prev,
        resumes: updatedResumes,
        currentView: 'profile',
        editingResume: null,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  // 経歴書削除処理
  const handleDeleteResume = async (resumeId: number) => {
    if (!confirm('この経歴書を削除しますか？')) return
    
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      await resumeApi.deleteResume(resumeId)
      const updatedResumes = await resumeApi.getResumes()
      
      setState(prev => ({
        ...prev,
        resumes: updatedResumes,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      console.error('削除エラー:', error)
    }
  }

  // キャンセル処理
  const handleCancel = () => {
    setState(prev => ({
      ...prev,
      currentView: 'profile',
      editingResume: null
    }))
  }

  // ログイン画面
  if (state.currentView === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        isLoading={state.isLoading}
      />
    )
  }

  // メイン画面（ナビゲーション付き）
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={state.user || undefined}
        currentView={state.currentView}
        onNavigate={handleNavigate}
      />
      
      <main>
        {state.currentView === 'profile' && state.user && (
          <ProfileScreen
            user={state.user}
            resumes={state.resumes}
            onCreateNew={() => handleNavigate('create')}
            onEditResume={handleEditResume}
            onDeleteResume={handleDeleteResume}
          />
        )}
        
        {state.currentView === 'create' && (
          <ResumeFormScreen
            skills={state.skills}
            onSave={handleCreateResume}
            onCancel={handleCancel}
            isLoading={state.isLoading}
          />
        )}
        
        {state.currentView === 'edit' && state.editingResume && (
          <ResumeFormScreen
            resume={state.editingResume}
            skills={state.skills}
            onSave={handleUpdateResume}
            onCancel={handleCancel}
            isLoading={state.isLoading}
          />
        )}
      </main>
      
      {/* API情報表示 */}
      <div className="fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 max-w-xs">
        <p className="font-semibold mb-1">🔧 開発メモ</p>
        <p>API: モック実装（別プロジェクトで実装予定）</p>
        <p>ログイン: tanaka@example.com / password</p>
      </div>
    </div>
  )
}