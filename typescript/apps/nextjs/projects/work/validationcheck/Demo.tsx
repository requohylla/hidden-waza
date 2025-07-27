'use client';

import { useState } from 'react';
import {
  InputField,
  TextareaField,
} from './components/ui/FormField';

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  address: string;
  bio: string;
};

type ErrorState = Partial<Record<keyof FormState, string>>;

const sampleData: FormState = {
  name: '山田 太郎',
  email: 'taro.yamada@example.com',
  phone: '090-1234-5678',
  password: 'Passw0rd!',
  passwordConfirm: 'Passw0rd!',
  address: '東京都千代田区1-1-1',
  bio: '自己紹介のサンプルです。',
};

function validateName(value: string) {
  if (!value) return '氏名を入力してください';
  if (value.length > 32) return '氏名は32文字以内で入力してください';
  return '';
}
function validateEmail(value: string) {
  const regex = /^\S+@\S+\.\S+$/;
  if (!value) return 'メールアドレスを入力してください';
  if (!regex.test(value)) return '有効なメールアドレスを入力してください';
  return '';
}
function validatePhone(value: string) {
  const regex = /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/;
  if (!value) return '電話番号を入力してください';
  if (!regex.test(value)) return '有効な電話番号を入力してください（例: 090-1234-5678）';
  return '';
}
function validatePassword(value: string) {
  if (!value) return 'パスワードを入力してください';
  if (value.length < 8) return 'パスワードは8文字以上必要です';
  if (!/[A-Z]/.test(value)) return 'パスワードには大文字を含めてください';
  if (!/[0-9]/.test(value)) return 'パスワードには数字を含めてください';
  if (!/[!@#$%^&*]/.test(value)) return 'パスワードには記号（!@#$%^&*）を含めてください';
  return '';
}
function validatePasswordConfirm(password: string, confirm: string) {
  if (!confirm) return '確認用パスワードを入力してください';
  if (password !== confirm) return 'パスワードが一致しません';
  return '';
}
function validateAddress(value: string) {
  if (value.length > 64) return '住所は64文字以内で入力してください';
  return '';
}
function validateBio(value: string) {
  if (value.length > 200) return '自己紹介は200文字以内で入力してください';
  return '';
}

export default function Demo() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    address: '',
    bio: '',
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [submitted, setSubmitted] = useState<'success' | 'error' | null>(null);

  // 各項目のバリデーション
  const validateAll = (state: FormState): ErrorState => ({
    name: validateName(state.name),
    email: validateEmail(state.email),
    phone: validatePhone(state.phone),
    password: validatePassword(state.password),
    passwordConfirm: validatePasswordConfirm(state.password, state.passwordConfirm),
    address: validateAddress(state.address),
    bio: validateBio(state.bio),
  });

  // 入力変更時
  const handleChange = (key: keyof FormState, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    setErrors((prev) => ({
      ...prev,
      [key]:
        key === 'passwordConfirm'
          ? validatePasswordConfirm(next.password, value)
          : key === 'password'
          ? validatePassword(value)
          : key === 'name'
          ? validateName(value)
          : key === 'email'
          ? validateEmail(value)
          : key === 'phone'
          ? validatePhone(value)
          : key === 'address'
          ? validateAddress(value)
          : key === 'bio'
          ? validateBio(value)
          : '',
    }));
    setSubmitted(null);
  };

  // サンプル自動入力
  const handleSample = () => {
    setForm(sampleData);
    setErrors(validateAll(sampleData));
    setSubmitted(null);
  };

  // 送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateAll(form);
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some((v) => v);
    setSubmitted(hasError ? 'error' : 'success');
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">バリデーションデモフォーム</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <InputField
          label="氏名"
          required
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="例: 山田 太郎"
        />
        <InputField
          label="メールアドレス"
          type="email"
          required
          value={form.email}
          onChange={e => handleChange('email', e.target.value)}
          error={errors.email}
          placeholder="例: taro@example.com"
        />
        <InputField
          label="電話番号"
          required
          value={form.phone}
          onChange={e => handleChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="例: 090-1234-5678"
        />
        <InputField
          label="パスワード"
          type="password"
          required
          value={form.password}
          onChange={e => handleChange('password', e.target.value)}
          error={errors.password}
          placeholder="8文字以上・大文字・数字・記号"
        />
        <InputField
          label="パスワード（確認）"
          type="password"
          required
          value={form.passwordConfirm}
          onChange={e => handleChange('passwordConfirm', e.target.value)}
          error={errors.passwordConfirm}
          placeholder="もう一度入力"
        />
        <InputField
          label="住所"
          value={form.address}
          onChange={e => handleChange('address', e.target.value)}
          error={errors.address}
          placeholder="任意"
        />
        <TextareaField
          label="自己紹介"
          value={form.bio}
          onChange={e => handleChange('bio', e.target.value)}
          error={errors.bio}
          placeholder="任意・200文字以内"
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handleSample}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            サンプル自動入力
          </button>
          <button
            type="submit"
            className={`px-3 py-2 rounded text-white ${Object.values(errors).some(v => v) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={Object.values(errors).some(v => v)}
          >
            送信
          </button>
        </div>
        {submitted === 'success' && (
          <div className="mt-2 text-green-600 font-bold">送信成功！</div>
        )}
        {submitted === 'error' && (
          <div className="mt-2 text-red-600 font-bold">入力内容に誤りがあります</div>
        )}
      </form>
    </div>
  );
}
