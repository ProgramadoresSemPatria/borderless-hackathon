'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
}

export function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedLabel = options.find(o => o.value === value)?.label

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border px-3 text-sm',
          'border-white/10 bg-white/[0.04] text-white',
          'focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20 focus:outline-none',
          !selectedLabel && 'text-[#4a4a4a]',
        )}
      >
        <span className="truncate">
          {selectedLabel || placeholder || 'Selecione…'}
        </span>
        <ChevronDown className={cn(
          'h-4 w-4 shrink-0 text-[#636363] transition-transform duration-150',
          open && 'rotate-180',
        )} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-white/10 bg-[#2a2a2b] p-1 shadow-lg max-h-[200px] overflow-y-auto">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setOpen(false) }}
              className={cn(
                'flex w-full items-center justify-between rounded px-2.5 py-1.5 text-sm',
                'hover:bg-white/[0.06]',
                option.value === value ? 'text-white' : 'text-[#b2b2b2]',
              )}
            >
              <span>{option.label}</span>
              {option.value === value && <Check className="h-3.5 w-3.5 text-[#9810fa]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
