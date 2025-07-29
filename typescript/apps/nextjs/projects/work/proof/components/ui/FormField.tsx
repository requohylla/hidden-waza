import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from 'react'

interface BaseFormFieldProps {
  label: string
  error?: string
  required?: boolean
  className?: string
  children?: ReactNode
}

interface InputFieldProps extends BaseFormFieldProps {
  type?: 'text' | 'email' | 'password' | 'date' | 'number'
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

interface MultiSelectFieldProps extends BaseFormFieldProps {
  values: number[]
  options: { value: number; label: string }[]
  onChange: (values: number[]) => void
  placeholder?: string
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

export function MultiSelectField({
  label,
  error,
  required = false,
  className = '',
  values,
  options,
  onChange,
  placeholder = 'アイテムを選択してください',
  ...props
}: MultiSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !values.includes(option.value)
  )

  const handleSelectOption = (option: { value: number; label: string }) => {
    onChange([...values, option.value])
    setSearchTerm('')
  }

  const handleRemoveOption = (optionToRemove: number) => {
    onChange(values.filter(value => value !== optionToRemove))
  }

  const dropdownClasses = `relative w-full border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${
    error ? 'border-red-500' : 'border-gray-300'
  }`

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className={dropdownClasses}>
        {/* Selected items display */}
        <div className="flex flex-wrap gap-2 p-3 pb-2">
          {values.map((value) => {
            const option = options.find(opt => opt.value === value)
            return (
              <span
                key={value}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {option ? option.label : value}
                <button
                  type="button"
                  onClick={() => handleRemoveOption(value)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  ×
                </button>
              </span>
            )
          })}
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            className="w-full px-3 py-2 border-0 focus:outline-none"
            placeholder={values.length === 0 ? placeholder : '追加で選択...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={(e) => {
              // ドロップダウン内のクリックを検出して閉じるのを防ぐ
              const relatedTarget = e.relatedTarget as HTMLElement
              if (!relatedTarget || !relatedTarget.closest('[data-dropdown]')) {
                setTimeout(() => setIsOpen(false), 150)
              }
            }}
          />
        </div>

        {/* Dropdown options */}
        {isOpen && filteredOptions.length > 0 && (
          <div
            data-dropdown
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none block"
                onMouseDown={(e) => {
                  e.preventDefault() // フォーカス変更を防ぐ
                  handleSelectOption(option)
                }}
                onClick={(e) => {
                  e.preventDefault()
                  handleSelectOption(option)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

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