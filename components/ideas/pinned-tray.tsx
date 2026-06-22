"use client"

import { useCallback, useRef, useEffect } from "react"
import { Pin, X, ChevronUp } from "lucide-react"
import { usePinnedIdeas } from "@/hooks/use-pinned-ideas"
import { useIdeas } from "@/hooks/use-ideas"
import { useHotkey } from "@tanstack/react-hotkeys"
import { SHORTCUTS } from "@/lib/shortcuts"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface PinnedTrayProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function PinnedCard({
  idea,
  onUnpin,
}: {
  idea: { id: string; content: string; created_at: string }
  onUnpin: (id: string) => void
}) {
  return (
    <div className="group flex items-start gap-2 px-3 py-3 hover:bg-accent/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug line-clamp-2 break-words">{idea.content}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Pin className="size-2.5 text-primary" />
          <span className="text-[10px] text-muted-foreground">
            {new Date(idea.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button
        onClick={() => onUnpin(idea.id)}
        className="shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
        aria-label="Unpin"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}

export function PinnedTray({ isOpen, onOpenChange }: PinnedTrayProps) {
  const { ideas, isLoading, mutate } = usePinnedIdeas()
  const { updatePin } = useIdeas({ status: "inbox" })
  const isMobile = useIsMobile()
  const hasPins = ideas.length > 0
  const extraCount = ideas.length - 1
  const trayRef = useRef<HTMLDivElement>(null)
  const previewCount = Math.min(ideas.length, 3)

  useHotkey(
    SHORTCUTS.togglePinnedTray.hotkeys[0],
    () => onOpenChange(!isOpen),
    { enabled: true },
  )

  useEffect(() => {
    if (!isOpen || isMobile) return
    const handler = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener("mousedown", handler)
    }
  }, [isOpen, onOpenChange, isMobile])

  const handleUnpin = useCallback(async (id: string) => {
    await updatePin(id, false)
    mutate()
  }, [updatePin, mutate])

  const loadingState = isLoading && ideas.length === 0 && (
    <div className="p-4 text-xs text-muted-foreground text-center">Loading...</div>
  )

  const emptyState = !isLoading && ideas.length === 0 && (
    <div className="p-4 text-xs text-muted-foreground text-center">No pinned ideas yet</div>
  )

  const listContent = ideas.length > 0 && (
    <div className="divide-y">
      {ideas.map((idea) => (
        <PinnedCard key={idea.id} idea={idea} onUnpin={handleUnpin} />
      ))}
    </div>
  )

  return (
    <>
      {!isMobile && hasPins && !isOpen && (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="fixed bottom-0 left-0 z-50 flex h-24 w-1/3 min-w-0 cursor-pointer items-stretch p-1.5 pb-2 text-left"
          aria-label={`Open pinned ideas (${ideas.length})`}
        >
          <div className="relative flex min-w-0 flex-1 flex-col justify-end overflow-hidden rounded-t-lg border border-b-0 bg-popover shadow-lg transition-colors hover:bg-accent/40">
            {ideas.slice(0, previewCount).map((idea, i) => (
              <div
                key={idea.id}
                className={cn(
                  "absolute inset-x-2 rounded-md border bg-popover px-2.5 py-2 shadow-sm transition-all",
                  i === 0 && "bottom-6 z-30 min-h-14",
                  i === 1 && "bottom-4 z-20 scale-[0.96] opacity-70",
                  i === 2 && "bottom-2 z-10 scale-[0.92] opacity-45",
                )}
              >
                {i === 0 ? (
                  <div className="flex min-w-0 items-start gap-2">
                    <Pin className="mt-0.5 size-3 shrink-0 text-primary" />
                    <p className="line-clamp-2 min-w-0 text-xs leading-snug text-foreground/85">
                      {idea.content}
                    </p>
                  </div>
                ) : (
                  <div className="h-3.5" />
                )}
              </div>
            ))}
            <div className="relative z-40 mt-auto flex h-6 items-center justify-center gap-1 border-t bg-popover/95 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              <ChevronUp className="size-3" />
              <span>{ideas.length} pinned</span>
              {extraCount > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] normal-case tracking-normal">
                  +{extraCount}
                </span>
              )}
            </div>
          </div>
        </button>
      )}

      {isMobile ? (
        isOpen && (
          <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-popover border-t rounded-t-xl shadow-lg max-h-[50vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pinned {hasPins && <span className="text-muted-foreground/50">({ideas.length})</span>}
              </span>
              <button
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close pinned tray"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto min-h-0 flex-1">
              {loadingState}
              {emptyState}
              {listContent}
            </div>
          </div>
        )
      ) : (
        isOpen && (
          <div
            ref={trayRef}
            className="fixed bottom-12 left-0 z-50 w-1/3 max-w-80 min-w-0 bg-popover border rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b shrink-0 bg-popover">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pinned ({ideas.length})
              </span>
              <button
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close pinned tray"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[40vh]">
              {loadingState}
              {emptyState}
              {listContent}
            </div>
          </div>
        )
      )}
    </>
  )
}
