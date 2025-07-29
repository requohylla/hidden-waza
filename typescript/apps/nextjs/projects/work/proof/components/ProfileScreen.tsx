import { PlusIcon, DocumentTextIcon, CalendarIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import React, { useState, useEffect, useRef } from 'react';

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
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterVerified, setFilterVerified] = useState<string>('');
  // Statistics carousel state
  const stats = [
    {
      icon: <DocumentTextIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />,
      label: '総経歴書数',
      value: resumes.length,
    },
    {
      icon: <CalendarIcon className="h-8 w-8 text-green-600 flex-shrink-0" />,
      label: '認証済み',
      value: resumes.filter(r => r.verified).length,
    },
    {
      icon: <TagIcon className="h-8 w-8 text-purple-600 flex-shrink-0" />,
      label: 'スキル種類',
      value: new Set(resumes.flatMap(r => r.skills.items.map(item => item.name))).size,
    },
  ];
  const [statIndex, setStatIndex] = useState(0);
  const statTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastManualTimeRef = useRef<number>(0);
  const AUTO_SLIDE_DELAY = 2000; // ms

  useEffect(() => {
    statTimerRef.current && clearInterval(statTimerRef.current);
    const tick = () => {
      const now = Date.now();
      if (now - lastManualTimeRef.current < AUTO_SLIDE_DELAY) return;
      setStatIndex(idx => (idx + 1) % stats.length);
    };
    statTimerRef.current = setInterval(tick, 2000);
    return () => {
      statTimerRef.current && clearInterval(statTimerRef.current);
    };
  }, [stats.length]);

  const handlePrevStat = () => {
    setStatIndex(idx => (idx - 1 + stats.length) % stats.length);
    lastManualTimeRef.current = Date.now();
  };
  const handleNextStat = () => {
    setStatIndex(idx => (idx + 1) % stats.length);
    lastManualTimeRef.current = Date.now();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP')
  }
  const filteredResumes = resumes.filter(r => {
    const titleMatch = r.title.toLowerCase().includes(filterTitle.toLowerCase());
    const verifiedMatch =
      filterVerified === ''
        ? true
        : filterVerified === 'verified'
        ? r.verified
        : !r.verified;
    return titleMatch && verifiedMatch;
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Profile Section */}
      <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="flex flex-col items-center gap-3 w-full min-w-0">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow ring-4 ring-blue-200 mx-auto">
              <span className="text-white text-2xl font-extrabold tracking-wide drop-shadow">
                {user.name.charAt(0)}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-wide text-center break-words truncate w-full max-w-full overflow-hidden">{user.name}</h1>
            <p className="text-base text-gray-500 font-medium text-center break-all w-full">{user.email}</p>
            <p className="text-sm text-gray-400 text-center mt-1 w-full">登録日: {formatDate(user.joinDate)}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="relative mb-8 w-full max-w-md mx-auto">
        <div className="overflow-hidden rounded-lg shadow-sm border bg-white">
          <div className="flex items-center justify-center h-32">
            <button
              type="button"
              aria-label="前へ"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-1 border border-gray-200 hover:bg-gray-100"
              onClick={handlePrevStat}
              style={{ zIndex: 2 }}
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex flex-col items-center justify-center w-full px-8">
              {stats[statIndex].icon}
              <p className="text-sm font-medium text-gray-600 mt-2">{stats[statIndex].label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats[statIndex].value}</p>
            </div>
            <button
              type="button"
              aria-label="次へ"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-1 border border-gray-200 hover:bg-gray-100"
              onClick={handleNextStat}
              style={{ zIndex: 2 }}
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-2 gap-2">
          {stats.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-2 h-2 rounded-full ${statIndex === idx ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">スワイプ・矢印で切替／自動スライド</div>
      </div>

      {/* Resume List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          {/* 説明 */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">経歴書一覧</h2>
            <span className="text-sm text-gray-500 block mt-1">
              あなたの経歴書を一覧表示します。タイトルや認証状態で絞り込みできます。
            </span>
          </div>
          {/* 新規作成ボタン＋検索欄 */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 min-w-0 w-full flex-wrap">
            <Button onClick={onCreateNew} className="flex items-center w-full md:w-auto min-w-0 text-xs px-1 py-1 break-words overflow-hidden">
              <PlusIcon className="h-4 w-4 mr-2" />
              新規経歴書作成
            </Button>
            <input
              type="text"
              placeholder="タイトルで絞り込み"
              className="border rounded px-1 py-1 text-xs w-full min-w-0 break-words overflow-hidden"
              value={filterTitle}
              onChange={e => setFilterTitle(e.target.value)}
            />
            <select
              className="border rounded px-1 py-1 text-xs w-full min-w-0 break-words overflow-hidden"
              value={filterVerified}
              onChange={e => setFilterVerified(e.target.value)}
            >
              <option value="">認証状態</option>
              <option value="verified">認証済みのみ</option>
              <option value="unverified">未認証のみ</option>
            </select>
          </div>
        </div>
        {filteredResumes.length === 0 ? (
          <div className="p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">経歴書がありません</h3>
            <p className="text-gray-600 mb-6">条件に合う経歴書がありません</p>
          </div>
        ) : (
          <div
            className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto w-full"
            style={{ minWidth: 0 }}
          >
            {filteredResumes.map((resume) => (
              <div key={resume.id} className="p-6 hover:bg-gray-50 transition-colors w-full min-w-0">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between min-w-0">
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xs sm:text-lg font-medium text-gray-900 break-words whitespace-normal w-full min-w-0 max-w-full">{resume.title}</h3>
                      {resume.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          認証済み
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2 break-words">{resume.description}</p>
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
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 break-words"
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