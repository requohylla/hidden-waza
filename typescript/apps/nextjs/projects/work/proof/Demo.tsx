// 職務経歴書デモ（技術証明登録・履歴表示）
// バックエンドAPI・BFFは別途実装予定。fetch部分はコメントで明記。

'use client'

import { useState } from 'react'

type Proof = {
  id: number
  title: string
  description: string
  date: string
  skill: string
  verified: boolean
}

export default function Demo() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    skill: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [proofs, setProofs] = useState<Proof[]>([])

  // バリデーション
  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!form.title) newErrors.title = 'タイトルは必須です'
    if (!form.description) newErrors.description = '内容は必須です'
    if (!form.date) newErrors.date = '日付は必須です'
    if (!form.skill) newErrors.skill = 'スキルは必須です'
    return newErrors
  }

  // 登録（APIは未実装。fetch部分はコメント）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    // TODO: バックエンドAPI（POST /api/workproof）で登録
    // const res = await fetch('/api/workproof', { method: 'POST', body: JSON.stringify(form) })

    // 仮登録（フロントのみ）
    setProofs([
      {
        id: Date.now(),
        ...form,
        verified: false
      },
      ...proofs
    ])
    setForm({ title: '', description: '', date: '', skill: '' })
  }

  // 履歴取得（APIは未実装。fetch部分はコメント）
  // useEffect(() => {
  //   // TODO: バックエンドAPI（GET /api/workproof）で履歴取得
  //   // fetch('/api/workproof').then(...)
  // }, [])

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>職務経歴書（技術証明）</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 'bold' }}>タイトル</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', border: '1px solid #ccc', padding: 6 }}
          />
          {errors.title && <p style={{ color: 'red', fontSize: 12 }}>{errors.title}</p>}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 'bold' }}>内容</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: '100%', border: '1px solid #ccc', padding: 6 }}
          />
          {errors.description && <p style={{ color: 'red', fontSize: 12 }}>{errors.description}</p>}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 'bold' }}>日付</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            style={{ width: '100%', border: '1px solid #ccc', padding: 6 }}
          />
          {errors.date && <p style={{ color: 'red', fontSize: 12 }}>{errors.date}</p>}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 'bold' }}>スキル</label>
          <input
            type="text"
            value={form.skill}
            onChange={e => setForm({ ...form, skill: e.target.value })}
            style={{ width: '100%', border: '1px solid #ccc', padding: 6 }}
          />
          {errors.skill && <p style={{ color: 'red', fontSize: 12 }}>{errors.skill}</p>}
        </div>
        <button
          type="submit"
          style={{
            background: '#2563eb',
            color: '#fff',
            padding: '8px 24px',
            borderRadius: 4,
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          disabled={Object.keys(errors).length > 0}
        >
          登録
        </button>
      </form>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>登録履歴</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {proofs.length === 0 && <li style={{ color: '#888' }}>履歴はありません</li>}
        {proofs.map(proof => (
          <li key={proof.id} style={{ border: '1px solid #ccc', borderRadius: 4, padding: 12, marginBottom: 8 }}>
            <div style={{ fontWeight: 'bold' }}>{proof.title}</div>
            <div style={{ fontSize: 14 }}>{proof.description}</div>
            <div style={{ fontSize: 12, color: '#555' }}>{proof.date} / {proof.skill}</div>
            <div style={{ fontSize: 12 }}>
              認証: {proof.verified ? '済' : '未'}
            </div>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
        ※ バックエンドAPI・BFFは別途実装予定です。現在はフロントのみの仮動作です。
      </p>
    </div>
  )
}