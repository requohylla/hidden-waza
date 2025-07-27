import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from 'react';

interface BaseFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children?: ReactNode;
}

interface InputFieldProps extends BaseFormFieldProps {
  type?: 'text' | 'email' | 'password' | 'date';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TextareaFieldProps extends BaseFormFieldProps {
  rows?: number;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface SelectFieldProps extends BaseFormFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

interface MultiSelectFieldProps extends BaseFormFieldProps {
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function InputField({
  label,
  error,
  required = false,
  className = '',
  type = 'text',
  placeholder,
  value,
  onChange,
  ...props
}: InputFieldProps) {
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block font-bold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}

export function TextareaField({
  label,
  error,
  required = false,
  className = '',
  rows = 4,
  placeholder,
  value,
  onChange,
  ...props
}: TextareaFieldProps) {
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block font-bold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={`w-full border rounded px-3 py-2 resize-vertical ${error ? 'border-red-500' : 'border-gray-300'}`}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}

export function SelectField({
  label,
  error,
  required = false,
  className = '',
  value,
  onChange,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block font-bold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={`w-full border rounded px-3 py-2 bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
        value={value}
        onChange={onChange}
        {...props}
      >
        {children}
      </select>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}

export function MultiSelectField({
  label,
  error,
  required = false,
  className = '',
  values,
  options,
  onChange,
  placeholder = '選択してください',
}: MultiSelectFieldProps) {
  const [input, setInput] = useState('');
  const filtered = options.filter(
    (opt) => opt.toLowerCase().includes(input.toLowerCase()) && !values.includes(opt)
  );
  return (
    <div className={`mb-2 ${className}`}>
      <label className="block font-bold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex flex-wrap gap-2 mb-1">
        {values.map((v) => (
          <span key={v} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
            {v}
            <button
              type="button"
              className="ml-1 text-blue-600 hover:text-blue-800"
              onClick={() => onChange(values.filter((val) => val !== v))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className={`w-full border rounded px-3 py-2 mb-1 ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={values.length === 0 ? placeholder : '追加で選択...'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="border rounded bg-white max-h-32 overflow-y-auto">
        {filtered.map((opt) => (
          <button
            key={opt}
            type="button"
            className="block w-full text-left px-3 py-1 hover:bg-blue-50"
            onMouseDown={() => {
              onChange([...values, opt]);
              setInput('');
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}