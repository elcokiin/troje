import { cn } from "@/lib/utils"

interface AppLogoProps {
  className?: string
  iconClassName?: string
  showWordmark?: boolean
}

export function AppLogo({
  className,
  iconClassName,
  showWordmark = true,
}: AppLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 180 180"
        className={cn("size-10 shrink-0", iconClassName)}
        fill="none"
      >
        <rect width="180" height="180" rx="40" className="fill-primary" />
        <path
          d="M44 72L90 42L136 72V133C136 139.627 130.627 145 124 145H56C49.373 145 44 139.627 44 133V72Z"
          className="fill-primary-foreground"
        />
        <path
          d="M44 72L90 42L136 72"
          stroke="#211A4F"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M66 91H114"
          stroke="#211A4F"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M66 119H101"
          stroke="#211A4F"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M115 119C115 110.716 121.716 104 130 104C130 112.284 123.284 119 115 119Z"
          fill="#F2C94C"
        />
        <circle cx="115" cy="119" r="8" fill="#211A4F" />
      </svg>
      {showWordmark && (
        <span className="text-xl font-semibold tracking-normal text-foreground">
          Troje
        </span>
      )}
    </div>
  )
}
