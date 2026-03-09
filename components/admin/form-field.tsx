'use client'
import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
}

export function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-[#b2b2b2]">
        {label}
        {required && <span className="ml-0.5 text-[#9810fa]">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-[#636363]">{hint}</p>}
    </div>
  )
}
