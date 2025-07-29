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

type FormData = {
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
}

// 防御的: resumeがundefinedでも必ず空配列
const safeSkillsItems = (resumeObj: Resume | undefined) =>
  Array.isArray(resumeObj?.skills?.items)
    ? resumeObj!.skills.items
    : Array.isArray(resumeObj?.skills)
      ? resumeObj!.skills
      : [];

const safeExperiences = (resumeObj: Resume | undefined) =>
  Array.isArray(resumeObj?.experiences)
    ? resumeObj!.experiences
    : [];

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

  const initialSkills =
    resume && resume.skills && Array.isArray(resume.skills.items)
      ? [...resume.skills.items]
      : Array.isArray(resume?.skills)
        ? [...resume.skills]
        : []

  const getSavedFormData = (): FormData => {
    const saved = SessionManager.getFormData(formType)
    if (saved && saved.skills && Array.isArray(saved.skills.items)) {
      return saved
    }
    return {
      title: resume?.title || '',
      description: resume?.description || '',
      date: resume?.date || '',
      skills: {
        items: safeSkillsItems(resume).map(item => ({
          ...item,
          level: item.level ?? '',
          years: item.years ?? 0
        }))
      },
      experiences: safeExperiences(resume)
    }
  }

  const [formData, setFormData] = useState<FormData>(getSavedFormData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState<string>('')
  const initialActiveTab = (() => {
    if (resume && resume.skills && Array.isArray(resume.skills.items) && resume.skills.items.length > 0) {
      return resume.skills.items[0].type as SkillCategory;
    }
    return 'os';
  })();
  const [activeTab, setActiveTab] = useState<SkillCategory>(initialActiveTab)

  useEffect(() => {
    if (resume) {
      SessionManager.clearFormData('edit');
      setFormData({
        title: resume.title,
        description: resume.description,
        date: resume.date,
        skills: {
          items: safeSkillsItems(resume).map(item => ({
            ...item,
            level: item.level ?? '',
            years: item.years ?? 0
          }))
        },
        experiences: safeExperiences(resume)
      });
      const firstTab =
        Array.isArray(resume.skills?.items) && resume.skills.items.length > 0
          ? resume.skills.items[0].type
          : 'os';
      setActiveTab(firstTab);
    }
  }, [resume])

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

    // experiencesのバリデーション
    formData.experiences.forEach((exp, idx) => {
      if (!exp.company) newErrors[`exp_company_${idx}`] = '会社名は必須です'
      if (!exp.position) newErrors[`exp_position_${idx}`] = '役職は必須です'
      if (!exp.start_date) newErrors[`exp_start_${idx}`] = '開始日は必須です'
      if (!exp.end_date) newErrors[`exp_end_${idx}`] = '終了日は必須です'
      if (!exp.description) newErrors[`exp_desc_${idx}`] = '業務内容は必須です'
    })

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
      SessionManager.clearFormData(formType)
      setSuccessMessage('保存に成功しました！')
    } catch (error) {
      setErrors({ general: '保存に失敗しました。もう一度お試しください。' })
    }
  }

  const handleCancel = () => {
    SessionManager.clearFormData(formType)
    onCancel()
  }

  const handleInputChange = (field: keyof Omit<FormData, 'skills' | 'experiences'>) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: e.target.value }))
    if (errors[field as string]) {
      setErrors((prev: { [key: string]: string }) => ({ ...prev, [field as string]: '' }))
    }
  }

  const handleSkillsChange = (category: 'os' | 'tools' | 'languages') => (selectedIds: number[]) => {
    const list =
      category === 'os'
        ? osList
        : category === 'tools'
        ? toolsList
        : languagesList

    const selectedItems = selectedIds.map(id => {
      const found = list.find(item => item.id === id)
      return found
        ? { type: category, master_id: id, name: found.name, level: '', years: 0 }
        : { type: category, master_id: id, name: String(id), level: '', years: 0 }
    })

    setFormData((prev: FormData) => {
      const grouped: { [key: string]: any[] } = {};
      prev.skills.items.forEach(item => {
        if (!grouped[item.type]) grouped[item.type] = [];
        grouped[item.type].push(item);
      });
      grouped[category] = selectedItems;
      const mergedItems = Object.values(grouped).flat();
      return {
        ...prev,
        skills: {
          ...prev.skills,
          items: mergedItems
        }
      };
    });
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
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {successMessage}
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
            <div className="bg-gray-50 rounded-lg p-6 min-h-[300px]">
              <MultiSelectField
                label={`${SKILL_CATEGORY_LABELS[activeTab]}を選択`}
                values={formData.skills.items.filter(item => item.type === activeTab).map(item => item.master_id)}
                options={
                  (
                    activeTab === 'os'
                      ? osList
                      : activeTab === 'tools'
                      ? toolsList
                      : activeTab === 'languages'
                      ? languagesList
                      : []
                  ).map(item => ({
                    value: item.id,
                    label: item.name ?? `ID:${item.id}`
                  }))
                }
                onChange={handleSkillsChange(activeTab)}
                placeholder={`${SKILL_CATEGORY_LABELS[activeTab]}を検索・選択してください`}
              />
              {formData.skills.items.filter(item => item.type === activeTab).length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    選択済み ({formData.skills.items.filter(item => item.type === activeTab).length}個)
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.items.filter(item => item.type === activeTab).map((skill, idx) => (
                      <div key={skill.master_id} className="flex flex-col items-start bg-blue-50 rounded px-2 py-1 m-1">
                        <span className="inline-flex items-center text-xs text-blue-800">
                          {skill.name}
                        </span>
                        <InputField
                          label="レベル"
                          value={skill.level}
                          onChange={e => {
                            const value = e.target.value
                            setFormData(prev => ({
                              ...prev,
                              skills: {
                                ...prev.skills,
                                items: prev.skills.items.map((s, i) =>
                                  s.type === skill.type && s.master_id === skill.master_id
                                    ? { ...s, level: value }
                                    : s
                                )
                              }
                            }))
                          }}
                          placeholder="例: 初級/中級/上級"
                          className="mt-1"
                        />
                        <InputField
                          label="経験年数"
                          type="number"
                          value={skill.years?.toString() ?? ''}
                          onChange={e => {
                            const value = Number(e.target.value)
                            setFormData(prev => ({
                              ...prev,
                              skills: {
                                ...prev.skills,
                                items: prev.skills.items.map((s, i) =>
                                  s.type === skill.type && s.master_id === skill.master_id
                                    ? { ...s, years: value }
                                    : s
                                )
                              }
                            }))
                          }}
                          placeholder="例: 3"
                          className="mt-1"
                        />
                      </div>
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

          {/* experiences入力欄 */}
          <div className="space-y-6 mt-8">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">職務経歴</h3>
              <p className="text-sm text-gray-600 mb-6">
                会社名、役職、期間、説明、ポートフォリオURLを記入してください（複数追加可能）
              </p>
            </div>
            {formData.experiences.map((exp, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-4 border">
                <InputField
                  label="会社名"
                  value={exp.company}
                  onChange={e => {
                    const value = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      experiences: prev.experiences.map((ex, i) =>
                        i === idx ? { ...ex, company: value } : ex
                      )
                    }))
                  }}
                  required
                  className="mb-2"
                  error={errors[`exp_company_${idx}`]}
                />
                <InputField
                  label="役職"
                  value={exp.position}
                  onChange={e => {
                    const value = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      experiences: prev.experiences.map((ex, i) =>
                        i === idx ? { ...ex, position: value } : ex
                      )
                    }))
                  }}
                  required
                  className="mb-2"
                  error={errors[`exp_position_${idx}`]}
                />
                <InputField
                  label="開始日"
                  type="date"
                  value={exp.start_date}
                  onChange={e => {
                    const value = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      experiences: prev.experiences.map((ex, i) =>
                        i === idx ? { ...ex, start_date: value } : ex
                      )
                    }))
                  }}
                  required
                  className="mb-2"
                  error={errors[`exp_start_${idx}`]}
                />
                <InputField
                  label="終了日"
                  type="date"
                  value={exp.end_date}
                  onChange={e => {
                    const value = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      experiences: prev.experiences.map((ex, i) =>
                        i === idx ? { ...ex, end_date: value } : ex
                      )
                    }))
                  }}
                  required
                  className="mb-2"
                  error={errors[`exp_end_${idx}`]}
                />
                <TextareaField
                  label="業務内容"
                  value={exp.description}
                  onChange={e => {
                    const value = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      experiences: prev.experiences.map((ex, i) =>
                        i === idx ? { ...ex, description: value } : ex
                      )
                    }))
                  }}
                  required
                  className="mb-2"
                  error={errors[`exp_desc_${idx}`]}
                />
                <InputField
                  label="ポートフォリオURL"
                  value={exp.portfolio_url}
                  onChange={e => {
                    const value = e.target.value
                    setFormData(prev => ({
                      ...prev,
                      experiences: prev.experiences.map((ex, i) =>
                        i === idx ? { ...ex, portfolio_url: value } : ex
                      )
                    }))
                  }}
                  className="mb-2"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      experiences: prev.experiences.filter((_, i) => i !== idx)
                    }))
                  }}
                  className="mt-2"
                >
                  削除
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  experiences: [
                    ...prev.experiences,
                    {
                      company: '',
                      position: '',
                      start_date: '',
                      end_date: '',
                      description: '',
                      portfolio_url: ''
                    }
                  ]
                }))
              }}
            >
              職務経歴を追加
            </Button>
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
                          {skill.name}（{skill.level} / {skill.years}年）
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
            <div className="mt-4">
              <span className="text-xs text-gray-500 font-medium">職務経歴:</span>
              {formData.experiences.length === 0 ? (
                <span className="text-xs text-gray-500 ml-2">未入力</span>
              ) : (
                <div className="space-y-2 mt-2">
                  {formData.experiences.map((exp, idx) => (
                    <div key={idx} className="border rounded p-2 bg-gray-50">
                      <div className="font-medium">{exp.company} / {exp.position}</div>
                      <div className="text-xs text-gray-500">
                        {exp.start_date} ~ {exp.end_date}
                      </div>
                      <div className="text-sm">{exp.description}</div>
                      {exp.portfolio_url && (
                        <div className="text-xs text-blue-600">
                          <a href={exp.portfolio_url} target="_blank" rel="noopener noreferrer">{exp.portfolio_url}</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}