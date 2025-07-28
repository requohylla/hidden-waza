import { PlusIcon, DocumentTextIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'

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
    }[]
  }
  verified: boolean
  createdAt: string
}

interface User {
  id: number
  name: string
  email: string
  joinDate: string
}

interface ProfileScreenProps {
  user: User
  resumes: Resume[]
  onCreateNew: () => void
  onEditResume: (resumeId: number) => void
  onDeleteResume: (resumeId: number) => void
}

export function ProfileScreen({ 
  user, 
  resumes, 
  onCreateNew, 
  onEditResume, 
  onDeleteResume 
}: ProfileScreenProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">登録日: {formatDate(user.joinDate)}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={onCreateNew} className="flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              新規経歴書作成
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総経歴書数</p>
              <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">認証済み</p>
              <p className="text-2xl font-bold text-gray-900">
                {resumes.filter(r => r.verified).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">スキル種類</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(resumes.flatMap(r => r.skills.items.map(item => item.name))).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">経歴書一覧</h2>
        </div>
        
        {resumes.length === 0 ? (
          <div className="p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">経歴書がありません</h3>
            <p className="text-gray-600 mb-6">最初の経歴書を作成してください</p>
            <Button onClick={onCreateNew}>
              <PlusIcon className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </div>
        ) : (
          <div
            className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto w-full"
            style={{ minWidth: 0 }}
          >
            {resumes.map((resume) => (
              <div key={resume.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{resume.title}</h3>
                      {resume.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          認証済み
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{resume.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(resume.date)}
                      </span>
                      <div className="flex items-start">
                        <TagIcon className="h-4 w-4 mr-1 mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {resume.skills.items
                            .map((item) => item.name)
                            .slice(0, 3)
                            .map((name, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                              >
                                {name}
                              </span>
                            ))}
                          {resume.skills.items.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{resume.skills.items.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0 md:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditResume(resume.id)}
                    >
                      編集
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteResume(resume.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}