import { UserIcon, DocumentIcon, PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface NavigationProps {
  currentUser?: {
    name: string
    email: string
  }
  currentView: 'profile' | 'create' | 'edit'
  onNavigate: (view: 'profile' | 'create' | 'logout') => void
}

export function Navigation({ currentUser, currentView, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center">
            <DocumentIcon className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">職務経歴書システム</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'profile'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              プロフィール
            </button>
            
            <button
              onClick={() => onNavigate('create')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'create' || currentView === 'edit'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              新規作成
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="hidden sm:flex items-center text-sm text-gray-700">
                <span className="font-medium">{currentUser.name}</span>
                <span className="ml-2 text-gray-500">{currentUser.email}</span>
              </div>
            )}
            
            <button
              onClick={() => onNavigate('logout')}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">ログアウト</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-200">
          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
              currentView === 'profile'
                ? 'text-blue-700'
                : 'text-gray-600'
            }`}
          >
            <UserIcon className="h-5 w-5 mb-1" />
            プロフィール
          </button>
          
          <button
            onClick={() => onNavigate('create')}
            className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
              currentView === 'create' || currentView === 'edit'
                ? 'text-blue-700'
                : 'text-gray-600'
            }`}
          >
            <PlusIcon className="h-5 w-5 mb-1" />
            新規作成
          </button>
        </div>
      </div>
    </nav>
  )
}