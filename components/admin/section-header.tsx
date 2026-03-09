'use client'

interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
      {title}
    </p>
  )
}
