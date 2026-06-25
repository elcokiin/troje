"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconTooltip } from "@/components/ui/icon-tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  MessageSquare,
  Globe,
  Pin,
  PinOff,
  Trash2,
  Check,
  Copy,
} from "lucide-react"
import { IdeaCardMenu } from "@/components/ideas/idea-card-menu"
import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"
import { cn } from "@/lib/utils"
import { SHORTCUTS } from "@/lib/shortcuts"
import {
  CARD_COLORS,
  formatTimeInTrash,
  formatRelativeDate,
} from "@/lib/ideas"
import type { IdeaCardProps } from "@/types/idea"

const mdComponents: Components = {
  p: ({ children, ...props }) => (
    <p className="text-sm leading-relaxed" {...props}>{children}</p>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="bg-muted px-[0.3em] py-[0.15em] rounded text-sm font-mono text-foreground" {...props}>
          {children}
        </code>
      )
    }
    return (
      <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-sm leading-relaxed my-2">
        <code className={cn("font-mono", className)} {...props}>
          {children}
        </code>
      </pre>
    )
  },
  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }) => <em className="italic" {...props}>{children}</em>,
  h1: ({ children, ...props }) => (
    <h1 className="text-xl font-bold mt-3 mb-1.5 leading-tight" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-lg font-bold mt-2.5 mb-1 leading-tight" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-base font-semibold mt-2 mb-1 leading-tight" {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-sm font-semibold mt-1.5 mb-0.5" {...props}>{children}</h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="text-sm font-medium mt-1.5 mb-0.5" {...props}>{children}</h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="text-sm font-medium mt-1.5 mb-0.5 text-muted-foreground" {...props}>{children}</h6>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-5 text-sm space-y-0.5" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-5 text-sm space-y-0.5" {...props}>{children}</ol>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic text-sm text-muted-foreground my-1.5" {...props}>{children}</blockquote>
  ),
  hr: () => <hr className="my-3 border-muted-foreground/20" />,
  a: ({ children, ...props }) => (
    <a className="text-primary underline underline-offset-2 hover:text-primary/80" {...props}>{children}</a>
  ),
}

export function IdeaCard({
  idea,
  onStatusChange,
  onPinChange,
  onColorChange,
  onPermanentDelete,
  isSelected = false,
  showTrashInfo = false,
}: IdeaCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMenuOpenChange = useCallback((open: boolean) => {
    if (!open && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setMenuOpen(open)
  }, [])

  const handleStatusChange = async (newStatus: "inbox" | "archived" | "deleted") => {
    setIsUpdating(true)
    try {
      await onStatusChange(idea.id, newStatus)
    } finally {
      setIsUpdating(false)
    }
    setMenuOpen(false)
  }

  const handlePinToggle = async () => {
    setIsUpdating(true)
    try {
      await onPinChange(idea.id, !idea.pinned)
    } finally {
      setIsUpdating(false)
    }
    setMenuOpen(false)
  }

  const handleColorSelect = async (colorId: string | null) => {
    setIsUpdating(true)
    try {
      await onColorChange(idea.id, colorId)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePermanentDelete = async () => {
    if (onPermanentDelete) {
      setIsUpdating(true)
      try {
        await onPermanentDelete(idea.id)
      } finally {
        setIsUpdating(false)
      }
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [isSelected])

  useHotkey(SHORTCUTS.openActions.hotkeys[0], () => setMenuOpen(true), {
    enabled: isSelected && !menuOpen,
    ignoreInputs: true,
    preventDefault: true,
    conflictBehavior: "allow",
  })

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(idea.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [idea.content])

  useHotkey(SHORTCUTS.copyIdea.hotkeys[0], handleCopy, {
    enabled: isSelected,
    ignoreInputs: true,
    preventDefault: true,
    conflictBehavior: "allow",
  })

  useHotkey(SHORTCUTS.togglePin.hotkeys[0], () => handlePinToggle(), {
    enabled: isSelected,
    ignoreInputs: true,
    preventDefault: true,
    conflictBehavior: "allow",
  })

  const selectedColor = CARD_COLORS.find((c) => c.id === idea.background_color)
  const cardStyle = selectedColor?.color
    ? { backgroundColor: selectedColor.color }
    : undefined

  return (
    <Card
      ref={cardRef}
      style={cardStyle}
      className={cn(
        "group transition-all duration-200 hover:shadow-md break-inside-avoid relative",
        isUpdating && "opacity-50 pointer-events-none",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        idea.background_color && "border-transparent",
      )}
    >
      <IconTooltip
        icon={
          idea.pinned ? (
            <PinOff className="size-3.5" />
          ) : (
            <Pin className="size-3.5" />
          )
        }
        label={idea.pinned ? "Unpin" : "Pin to top"}
        shortcut={SHORTCUTS.togglePin.hotkeys[0]}
        side="top"
        onClick={handlePinToggle}
        className={cn(
          "absolute top-2 right-10 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
          idea.pinned && "text-primary sm:opacity-100",
          isSelected && "sm:opacity-100",
        )}
      />

      <IconTooltip
        icon={
          copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )
        }
        label="Copy text"
        shortcut={SHORTCUTS.copyIdea.hotkeys[0]}
        side="top"
        onClick={handleCopy}
        className={cn(
          "absolute top-2 right-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
          isSelected && "sm:opacity-100",
        )}
      />

      <DropdownMenu open={menuOpen} onOpenChange={handleMenuOpenChange}>
        <IdeaCardMenu
          idea={idea}
          copied={copied}
          showTrashInfo={showTrashInfo}
          onStatusChange={handleStatusChange}
          onColorSelect={handleColorSelect}
          onPinToggle={handlePinToggle}
          onPermanentDelete={handlePermanentDelete}
          onCopy={handleCopy}
        />
        <CardContent className="pt-2 pl-4 pr-10">
          <div className="space-y-3">
            <div className="text-sm leading-relaxed">
              <ReactMarkdown components={mdComponents}>
                {idea.content}
              </ReactMarkdown>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {idea.source === "telegram" ? (
                  <MessageSquare className="size-3" />
                ) : (
                  <Globe className="size-3" />
                )}
                {showTrashInfo && idea.deleted_at ? (
                  <span className="text-destructive/70 flex items-center gap-1">
                    <Trash2 className="size-3" />
                    {formatTimeInTrash(idea.deleted_at)}
                  </span>
                ) : (
                  <span>{formatRelativeDate(idea.created_at)}</span>
                )}
                {idea.pinned && <Pin className="size-3 text-primary" />}
              </div>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn(
                    "size-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity -mr-1.5",
                    isSelected && "opacity-100",
                  )}
                >
                  <IconTooltip
                    icon={<MoreHorizontal className="size-3.5" />}
                    label="More actions"
                    shortcut={SHORTCUTS.openActions.hotkeys[0]}
                    side="top"
                    asChild
                  />
                </Button>
              </DropdownMenuTrigger>
            </div>
            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {idea.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-1.5 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </DropdownMenu>
    </Card>
  )
}
