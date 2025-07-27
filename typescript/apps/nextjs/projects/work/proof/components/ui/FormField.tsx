import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

interface BaseFormFieldProps {
  label: string
  error?: string
  required?: boolean
  className?: string
  children?: ReactNode
}

interface InputFieldProps extends BaseFormFieldProps {
  type?: 'text' | 'email' | 'password' | 'date'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface TextareaFieldProps extends BaseFormFieldProps {
  rows?: number
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

interface SelectFieldProps extends BaseFormFieldProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: ReactNode
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
  const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    error ? 'border-red-500' : 'border-gray-300'
  }`

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
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
  const textareaClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
    error ? 'border-red-500' : 'border-gray-300'
  }`

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={textareaClasses}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
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
  const selectClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
    error ? 'border-red-500' : 'border-gray-300'
  }`

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={selectClasses}
        value={value}
        onChange={onChange}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}