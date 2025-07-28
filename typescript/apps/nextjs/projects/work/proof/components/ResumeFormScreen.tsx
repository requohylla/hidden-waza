import { useState, useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { InputField, TextareaField, MultiSelectField } from './ui/FormField'
import { SessionManager } from './utils/sessionManager'
import { SKILLS_BY_CATEGORY, SKILL_CATEGORY_LABELS, SkillCategory, getAllCategories, getSkillsByCategory } from './data/skills'

interface Resume {
  id?: number
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
  verified?: boolean
}

interface ResumeFormScreenProps {
  resume?: Resume
  onSave: (resumeData: Omit<Resume, 'id' | 'verified'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  osList: { id: number, name: string }[]
  toolsList: { id: number, name: string }[]
  languagesList: { id: number, name: string }[]
}

export function ResumeFormScreen({
  resume,
  onSave,
  onCancel,
  isLoading = false,
  osList,
  toolsList,
  languagesList,
}: ResumeFormScreenProps) {
  const formType = resume ? 'edit' : 'create'

  // skills初期値生成: items配列 or SkillDTO[]配列
  // 既存の宣言を削除し、初期値生成を一箇所に統一

  type FormData = {
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

  const initialSkills =
    resume && resume.skills && Array.isArray(resume.skills.items)
      ? resume.skills.items
      : Array.isArray(resume?.skills)
        ? resume.skills
        : [];
  
  // 保存されたフォームデータを復元
  const getSavedFormData = (): FormData => {
    const saved = SessionManager.getFormData(formType)
    if (saved && saved.skills && Array.isArray(saved.skills.items)) {
      return saved
    }
    
    // 保存データがない場合は初期値
    return {
      title: resume?.title || '',
      description: resume?.description || '',
      date: resume?.date || '',
      skills: {
        items: []
      }
    }
  }

  const [formData, setFormData] = useState<FormData>(getSavedFormData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState<SkillCategory>('os')

  // 編集時は既存データをセット（ただし保存データがあれば優先）
  useEffect(() => {
    if (resume) {
      const saved = SessionManager.getFormData('edit')
      if (!saved) {
        setFormData({
          title: resume.title,
          description: resume.description,
          date: resume.date,
          skills: resume.skills
        })
      }
    }
  }, [resume])

  // フォームデータ変更時に自動保存
  useEffect(() => {
    if (
      formData.title ||
      formData.description ||
      formData.date ||
      formData.skills.items.length > 0
    ) {
      SessionManager.saveFormData(formData, formType)
    }
  }, [formData, formType])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '詳細説明は必須です'
    }
    
    if (!formData.date) {
      newErrors.date = '日付は必須です'
    }
    
    if (formData.skills.items.length === 0) {
      newErrors.skills = '少なくとも1つのスキルを選択してください'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validate()
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      await onSave(formData)
      // 保存成功時にフォームデータをクリア
      SessionManager.clearFormData(formType)
    } catch (error) {
      setErrors({ general: '保存に失敗しました。もう一度お試しください。' })
    }
  }

  const handleCancel = () => {
    // キャンセル時にフォームデータをクリア
    SessionManager.clearFormData(formType)
    onCancel()
  }

  const handleInputChange = (field: keyof Omit<FormData, 'skills'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: e.target.value }))
    if (errors[field as string]) {
      setErrors((prev: { [key: string]: string }) => ({ ...prev, [field as string]: '' }))
    }
  }

  const handleSkillsChange = (category: 'os' | 'tools' | 'languages') => (selectedIds: number[]) => {
    // 選択されたIDからnameを取得し、skills.itemsにtype/master_id/nameで格納
    const list =
      category === 'os'
        ? osList
        : category === 'tools'
        ? toolsList
        : languagesList

    const selectedItems = selectedIds.map(id => {
      const found = list.find(item => item.id === id)
      return found
        ? { type: category, master_id: id, name: found.name }
        : { type: category, master_id: id, name: String(id) }
    })

    setFormData((prev: FormData) => ({
      ...prev,
      skills: {
        ...prev.skills,
        items: [
          // 他カテゴリの既存itemsを残し、同カテゴリは上書き
          ...prev.skills.items.filter(item => item.type !== category),
          ...selectedItems
        ]
      }
    }))
    if (errors.skills) {
      setErrors((prev: { [key: string]: string }) => ({ ...prev, skills: '' }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          戻る
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {resume ? '経歴書編集' : '新規経歴書作成'}
        </h1>
        <p className="mt-2 text-gray-600">
          あなたの職務経歴について詳しく記入してください
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          <InputField
            label="タイトル"
            value={formData.title}
            onChange={handleInputChange('title')}
            error={errors.title}
            placeholder="例: Reactを使用したWebアプリケーション開発"
            required
          />

          <TextareaField
            label="詳細説明"
            value={formData.description}
            onChange={handleInputChange('description')}
            error={errors.description}
            rows={6}
            placeholder="プロジェクトの概要、担当した役割、使用した技術、達成した成果などを詳しく記入してください"
            required
          />

          <InputField
            label="実施日"
            type="date"
            value={formData.date}
            onChange={handleInputChange('date')}
            error={errors.date}
            required
            className="md:w-1/2"
          />

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">スキル選択</h3>
              <p className="text-sm text-gray-600 mb-6">
                各カテゴリーから関連するスキルを選択してください（複数選択可能）
              </p>
            </div>
            
            {/* タブナビゲーション */}
            <div className="border-b border-gray-200">
              <div className="overflow-x-auto">
                <nav className="-mb-px flex space-x-6 min-w-max" aria-label="Tabs">
                  {getAllCategories().map((category) => {
                    const isActive = activeTab === category
                    const selectedCount = formData.skills.items.filter(item => item.type === category).length
                    
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveTab(category)}
                        className={`whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors min-w-fit ${
                          isActive
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {SKILL_CATEGORY_LABELS[category]}
                        {selectedCount > 0 && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedCount}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
            
            {/* タブコンテンツ */}
            <div className="bg-gray-50 rounded-lg p-6 min-h-[300px]">
              <MultiSelectField
                label={`${SKILL_CATEGORY_LABELS[activeTab]}を選択`}
                values={formData.skills.items.filter(item => item.type === activeTab).map(item => item.master_id)}
                options={
                  (activeTab === 'os'
                    ? osList
                    : activeTab === 'tools'
                    ? toolsList
                    : activeTab === 'languages'
                    ? languagesList
                    : []
                  ).map(item => ({ value: item.id, label: item.name }))
                }
                onChange={handleSkillsChange(activeTab)}
                placeholder={`${SKILL_CATEGORY_LABELS[activeTab]}を検索・選択してください`}
              />
              
              {/* 選択済みスキルの概要 */}
              {formData.skills.items.filter(item => item.type === activeTab).length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    選択済み ({formData.skills.items.filter(item => item.type === activeTab).length}個)
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.items.filter(item => item.type === activeTab).map((skill) => (
                      <span
                        key={skill.master_id}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {errors.skills && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {errors.skills}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : (resume ? '更新' : '作成')}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">プレビュー</h2>
        <div className="bg-white rounded border p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            {formData.title || 'タイトルを入力してください'}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {formData.description || '詳細説明を入力してください'}
          </p>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">
              <span>日付: {formData.date || '未設定'}</span>
            </div>
            <div className="space-y-2">
              {getAllCategories().map((category) => {
                const categorySkills = formData.skills.items.filter(item => item.type === category)
                if (categorySkills.length === 0) return null
                
                return (
                  <div key={category}>
                    <span className="text-xs text-gray-500 font-medium">
                      {SKILL_CATEGORY_LABELS[category]}:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.master_id}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
              {formData.skills.items.length === 0 && (
                <span className="text-xs text-gray-500">スキル: 未選択</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}