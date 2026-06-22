"use client"

import { useCallback, useEffect, useRef } from "react"
import { Pin, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePinnedIdeas } from "@/hooks/use-pinned-ideas"
import { useIdeas } from "@/hooks/use-ideas"
import { useHotkey } from "@tanstack/react-hotkeys"
import { SHORTCUTS } from "@/lib/shortcuts"

interface PinnedTrayProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function PinnedTray({ isOpen, onOpenChange }: PinnedTrayProps) {
  const { ideas, isLoading, mutate } = usePinnedIdeas()
  const { updatePin } = useIdeas({ status: "inbox" })
  const trayRef = useRef<HTMLDivElement>(null)

  useHotkey({
    hotkey: SHORTCUTS.togglePin.hotkeys[0],
    callback: () => onOpenChange(!isOpen),
    options: { enabled: true, preventDefault: true },
  })

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onOpenChange])

  const handleUnpin = useCallback(async (id: string) => {
    await updatePin(id, false)
    mutate()
  }, [updatePin, mutate])

  const hasPins = ideas.length > 0

  return (
    <div ref={trayRef} className="fixed bottom-0 left-0 z-50 pointer-events-none">
      <div
        className={cn(
          "absolute bottom-full left-0 mb-1 sm:ml-1 w-full sm:w-80 max-h-[60vh] bg-popover border rounded-t-lg sm:rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-out",
          isOpen && hasPins
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-3 py-2.5 border-b">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Pinned
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close pinned tray"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(60vh-44px)]">
          {isLoading && ideas.length === 0 ? (
            <div className="p-4 text-xs text-muted-foreground text-center">
              Loading...
            </div>
          ) : ideas.length === 0 ? (
            <div className="p-4 text-xs text-muted-foreground text-center">
              No pinned ideas yet
            </div>
          ) : (
            <div className="divide-y">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="group flex items-start gap-2 px-3 py-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug line-clamp-2 break-words">
                      {idea.content}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Pin className="size-2.5 text-primary" />
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(idea.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnpin(idea.id)}
                    className="shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    aria-label="Unpin"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
