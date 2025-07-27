import { useState } from 'react'
import { DocumentIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { InputField } from './ui/FormField'

interface LoginScreenProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>
  isLoading?: boolean
}

export function LoginScreen({ onLogin, isLoading = false }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です'
    }
    
    if (!formData.password) {
      newErrors.password = 'パスワードは必須です'
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
      await onLogin(formData)
    } catch (error) {
      setErrors({ general: 'ログインに失敗しました' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">ログイン</h2>
          <p className="mt-2 text-sm text-gray-600">職務経歴書管理システム</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}
          
          <InputField
            label="メールアドレス"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            required
          />
          
          <InputField
            label="パスワード"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            error={errors.password}
            required
          />
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>
      </div>
    </div>
  )
}