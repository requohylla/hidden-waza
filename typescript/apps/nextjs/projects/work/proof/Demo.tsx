'use client'

import { useState, useEffect } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { ResumeFormScreen } from './components/ResumeFormScreen'
import { Navigation } from './components/ui/Navigation'
import { authApi, resumeApi, skillApi, User } from './components/api/api'
import { getSkills } from './components/data/skills'
import { SessionManager } from './components/utils/sessionManager'

type View = 'login' | 'profile' | 'create' | 'edit'

interface Resume {
  id: number
  title: string
  description: string
  date: string
  skills: {
    items: {
      type: 'os' | 'tools' | 'languages'
      master_id: number
      name: string
      level: string
      years: number
    }[]
  }
  experiences: {
    company: string
    position: string
    start_date: string
    end_date: string
    description: string
    portfolio_url: string
  }[]
  verified: boolean
  createdAt: string
  updatedAt: string
}

interface AppState {
  currentView: View
  user: User | null
  resumes: Resume[]
  skills: {
    items: {
      type: 'os' | 'tools' | 'languages'
      master_id: number
      name: string
      level: string
      years: number
    }[]
  }
  osList: { id: number; name: string }[]
  toolsList: { id: number; name: string }[]
  languagesList: { id: number; name: string }[]
  editingResume: Resume | null
  isLoading: boolean
  isInitializing: boolean
}

// より厳密な空配列セット
function convertResumeApiToResume(apiResume: any): Resume {
  let skillsArray: any[] = [];
  if (apiResume && apiResume.skills) {
    if (Array.isArray(apiResume.skills.items)) {
      skillsArray = apiResume.skills.items;
    } else if (Array.isArray(apiResume.skills)) {
      skillsArray = apiResume.skills;
    }
  }
  let experiencesArray: any[] = [];
  if (apiResume && Array.isArray(apiResume.experiences)) {
    experiencesArray = apiResume.experiences;
  }
  return {
    ...apiResume,
    id: typeof apiResume.id === 'number' ? apiResume.id : 0,
    skills: {
      items: Array.isArray(skillsArray)
        ? skillsArray.map((item: any) => ({
            ...item,
            level: item?.level ?? '',
            years: item?.years ?? 0
          }))
        : []
    },
    experiences: Array.isArray(experiencesArray)
      ? experiencesArray.map((exp: any) => ({
          ...exp,
          company: exp?.company ?? '',
          position: exp?.position ?? '',
          start_date: exp?.start_date ?? '',
          end_date: exp?.end_date ?? '',
          description: exp?.description ?? '',
          portfolio_url: exp?.portfolio_url ?? ''
        }))
      : [],
    verified: apiResume.verified ?? false,
    createdAt: apiResume.createdAt ?? apiResume.created_at ?? '',
    updatedAt: apiResume.updatedAt ?? apiResume.updated_at ?? ''
  }
}

export default function Demo() {
  const initialSession = typeof window !== 'undefined' ? SessionManager.getSession() : null

  const [state, setState] = useState<AppState>({
    currentView: initialSession ? 'profile' : 'login',
    user: initialSession?.user || null,
    resumes: [],
    skills: { items: [] },
    osList: [],
    toolsList: [],
    languagesList: [],
    editingResume: null,
    isLoading: false,
    isInitializing: !!initialSession
  })

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const skills = getSkills()
        const [osList, toolsList, languagesList] = await Promise.all([
          skillApi.getOSList(),
          skillApi.getTools(),
          skillApi.getLanguages()
        ])

        const savedView = SessionManager.getCurrentView()
        let targetView = state.currentView

        if (state.user) {
          const apiResumes = await resumeApi.getResumes(state.user?.id)
          const resumes = Array.isArray(apiResumes)
            ? apiResumes.map(convertResumeApiToResume)
            : []
          const osMaster = osList.map((x: any) => ({ id: x.id, name: x.name }))
          const toolsMaster = toolsList.map((x: any) => ({ id: x.id, name: x.name }))
          const languagesMaster = languagesList.map((x: any) => ({ id: x.id, name: x.name }))

          if (savedView && (savedView === 'profile' || savedView === 'create' || savedView === 'edit')) {
            targetView = savedView as any
          }

          setState(prev => ({
            ...prev,
            currentView: targetView,
            resumes,
            skills: { items: [] },
            osList: osMaster,
            toolsList: toolsMaster,
            languagesList: languagesMaster,
            isInitializing: false
          }))
        } else {
          const osMaster = osList.map((x: any) => ({ id: x.id, name: x.name }))
          const toolsMaster = toolsList.map((x: any) => ({ id: x.id, name: x.name }))
          const languagesMaster = languagesList.map((x: any) => ({ id: x.id, name: x.name }))
          setState(prev => ({
            ...prev,
            skills: { items: [] },
            osList: osMaster,
            toolsList: toolsMaster,
            languagesList: languagesMaster,
            isInitializing: false
          }))
        }
      } catch (error) {
        console.error('初期化エラー:', error)
        setState(prev => ({
          ...prev,
          skills: { items: [] },
          isInitializing: false
        }))
      }
    }

    initializeApp()
  }, [])

  useEffect(() => {
    if (state.user && !state.isInitializing) {
      SessionManager.saveCurrentView(state.currentView)
    }
  }, [state.currentView, state.user, state.isInitializing])

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const { user, token } = await authApi.login(credentials)
      const apiResumes = await resumeApi.getResumes(user.id)
      SessionManager.saveSession(user, token)
      const resumes = Array.isArray(apiResumes)
        ? apiResumes.map(convertResumeApiToResume)
        : []

      setState(prev => ({
        ...prev,
        user,
        resumes,
        currentView: 'profile',
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      console.error('ログイン処理エラー:', error)
      throw error
    }
  }

  const handleNavigate = (view: 'profile' | 'create' | 'logout') => {
    if (view === 'logout') {
      SessionManager.clearSession()
      setState({
        currentView: 'login',
        user: null,
        resumes: [],
        skills: state.skills,
        osList: [],
        toolsList: [],
        languagesList: [],
        editingResume: null,
        isLoading: false,
        isInitializing: false
      })
    } else {
      SessionManager.extendSession()
      setState(prev => ({
        ...prev,
        currentView: view,
        editingResume: null
      }))
    }
  }

  const handleCreateResume = async (resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const newResume = await resumeApi.createResume(resumeData)
      const apiResumes = await resumeApi.getResumes()
      const updatedResumes = Array.isArray(apiResumes)
        ? apiResumes.map(convertResumeApiToResume)
        : []
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

  const handleUpdateResume = async (resumeData: Omit<Resume, 'id' | 'userId' | 'verified' | 'createdAt' | 'updatedAt'>) => {
    if (!state.editingResume) return

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      await resumeApi.updateResume(state.editingResume.id, resumeData)
      const apiResumes = await resumeApi.getResumes()
      const updatedResumes = Array.isArray(apiResumes)
        ? apiResumes.map(convertResumeApiToResume)
        : []
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

  const handleDeleteResume = async (resumeId: number) => {
    if (!confirm('この経歴書を削除しますか？')) return

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      await resumeApi.deleteResume(resumeId)
      const apiResumes = await resumeApi.getResumes()
      const updatedResumes = Array.isArray(apiResumes)
        ? apiResumes.map(convertResumeApiToResume)
        : []
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

  const handleCancel = () => {
    setState(prev => ({
      ...prev,
      currentView: 'profile',
      editingResume: null
    }))
  }

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

  if (state.currentView === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        isLoading={state.isLoading}
      />
    )
  }

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
            onEditResume={async (resumeId: number) => {
              const apiResume = await resumeApi.getResumeById(resumeId);
              const resume = convertResumeApiToResume(apiResume);
              setState(prev => ({
                ...prev,
                editingResume: resume,
                currentView: 'edit'
              }));
            }}
            onDeleteResume={handleDeleteResume}
          />
        )}

        {state.currentView === 'create' && (
          <ResumeFormScreen
            onSave={handleCreateResume}
            onCancel={handleCancel}
            isLoading={state.isLoading}
            osList={state.osList}
            toolsList={state.toolsList}
            languagesList={state.languagesList}
          />
        )}

        {state.currentView === 'edit' && state.editingResume && (
          <ResumeFormScreen
            resume={state.editingResume}
            onSave={handleUpdateResume}
            onCancel={handleCancel}
            isLoading={state.isLoading}
            osList={state.osList}
            toolsList={state.toolsList}
            languagesList={state.languagesList}
          />
        )}
      </main>      
    </div>
  )
}