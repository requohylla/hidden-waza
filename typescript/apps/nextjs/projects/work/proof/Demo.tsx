// 職務経歴書デモ（本格版）
// ログイン → プロフィール → 経歴書作成・編集の完全なフロー
// セッション管理機能付き

'use client'

import { useState, useEffect } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { ResumeFormScreen } from './components/ResumeFormScreen'
import { Navigation } from './components/ui/Navigation'
import { authApi, resumeApi, skillApi, User, Resume } from './components/api/mockApi'
import { getSkills } from './components/data/skills'
import { SessionManager } from './components/utils/sessionManager'

type View = 'login' | 'profile' | 'create' | 'edit'

interface AppState {
  currentView: View
  user: User | null
  resumes: Resume[]
  skills: string[]
  editingResume: Resume | null
  isLoading: boolean
  isInitializing: boolean
}

export default function Demo() {
  // 初期状態でセッションチェック
  const initialSession = typeof window !== 'undefined' ? SessionManager.getSession() : null
  
  const [state, setState] = useState<AppState>({
    currentView: initialSession ? 'profile' : 'login',
    user: initialSession?.user || null,
    resumes: [],
    skills: [],
    editingResume: null,
    isLoading: false,
    isInitializing: !!initialSession // セッションがある場合のみ初期化フラグ
  })

  // 初期化：セッションがある場合のみデータ読み込み
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // スキル一覧取得
        const skills = getSkills()
        
        if (state.user && state.currentView === 'profile') {
          // セッションがある場合、経歴書一覧を取得
          const resumes = await resumeApi.getResumes()
          setState(prev => ({
            ...prev,
            resumes,
            skills,
            isInitializing: false
          }))
        } else {
          // セッションがない場合はスキルのみ設定
          setState(prev => ({
            ...prev,
            skills,
            isInitializing: false
          }))
        }
      } catch (error) {
        console.error('初期化エラー:', error)
        setState(prev => ({
          ...prev,
          skills: getSkills(),
          isInitializing: false
        }))
      }
    }
    
    initializeApp()
  }, [])

  // ログイン処理
  const handleLogin = async (credentials: { email: string; password: string }) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const { user, token } = await authApi.login(credentials)
      const resumes = await resumeApi.getResumes()
      
      // セッションを保存
      SessionManager.saveSession(user, token)
      
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
      // セッションをクリア
      SessionManager.clearSession()
      
      setState({
        currentView: 'login',
        user: null,
        resumes: [],
        skills: state.skills,
        editingResume: null,
        isLoading: false,
        isInitializing: false
      })
    } else {
      // セッション延長
      SessionManager.extendSession()
      
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

  // セッションがある場合の初期化中はローディング画面
  if (state.isInitializing && state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込んでいます...</p>
        </div>
      </div>
    )
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
    </div>
  )
}