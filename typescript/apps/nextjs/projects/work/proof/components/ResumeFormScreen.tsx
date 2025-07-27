import { useState, useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { InputField, TextareaField, SelectField } from './ui/FormField'

interface Resume {
  id?: number
  title: string
  description: string
  date: string
  skill: string
  verified?: boolean
}

interface ResumeFormScreenProps {
  resume?: Resume
  skills: string[]
  onSave: (resumeData: Omit<Resume, 'id' | 'verified'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ResumeFormScreen({ 
  resume, 
  skills, 
  onSave, 
  onCancel, 
  isLoading = false 
}: ResumeFormScreenProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    skill: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (resume) {
      setFormData({
        title: resume.title,
        description: resume.description,
        date: resume.date,
        skill: resume.skill
      })
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
    
    if (!formData.skill) {
      newErrors.skill = 'スキルの選択は必須です'
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
    } catch (error) {
      setErrors({ general: '保存に失敗しました。もう一度お試しください。' })
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="実施日"
              type="date"
              value={formData.date}
              onChange={handleInputChange('date')}
              error={errors.date}
              required
            />

            <SelectField
              label="主要スキル"
              value={formData.skill}
              onChange={handleInputChange('skill')}
              error={errors.skill}
              required
            >
              <option value="">スキルを選択してください</option>
              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
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
          <div className="flex space-x-4 text-xs text-gray-500">
            <span>日付: {formData.date || '未設定'}</span>
            <span>スキル: {formData.skill || '未選択'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}