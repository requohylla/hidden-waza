'use client';

import { useState } from 'react';

export default function Demo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // メールアドレスの簡易チェック
  const validateEmail = (value: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    if (!value) return 'メールアドレスを入力してください';
    if (!regex.test(value)) return '有効なメールアドレスを入力してください';
    return '';
  };

  // パスワードの強度チェック
  const validatePassword = (value: string) => {
    if (!value) return 'パスワードを入力してください';
    if (value.length < 8) return 'パスワードは8文字以上必要です';
    if (!/[A-Z]/.test(value)) return 'パスワードには大文字を含めてください';
    if (!/[0-9]/.test(value)) return 'パスワードには数字を含めてください';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });
    if (!emailError && !passwordError) {
      alert('送信成功！');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px',
      }}
    >
      {/* メールアドレス入力 */}
      <div>
        <label htmlFor="email">メールアドレス：</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            const v = e.target.value;
            setEmail(v);
            setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
          }}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
        {errors.email && (
          <p style={{ color: 'red', marginTop: '0.25rem' }}>{errors.email}</p>
        )}
      </div>

      {/* パスワード入力 */}
      <div>
        <label htmlFor="password">パスワード：</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            const v = e.target.value;
            setPassword(v);
            setErrors((prev) => ({ ...prev, password: validatePassword(v) }));
          }}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
        {errors.password && (
          <p style={{ color: 'red', marginTop: '0.25rem' }}>{errors.password}</p>
        )}
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={!!errors.email || !!errors.password}
        style={{
          padding: '0.75rem',
          backgroundColor: !!errors.email || !!errors.password ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          cursor: !!errors.email || !!errors.password ? 'not-allowed' : 'pointer',
        }}
      >
        送信
      </button>
    </form>
  );
}
