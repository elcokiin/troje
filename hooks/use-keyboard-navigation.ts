"use client"

import { useMemo } from "react"
import { useHotkeys, type UseHotkeyDefinition } from "@tanstack/react-hotkeys"
import { SHORTCUTS } from "@/lib/shortcuts"

interface UseKeyboardNavigationOptions {
  itemCount: number
  selectedIndex: number
  onSelect: (index: number) => void
  onAction?: (index: number) => void
  onNew?: () => void
  enabled?: boolean
}

export function useKeyboardNavigation({
  itemCount,
  selectedIndex,
  onSelect,
  onAction,
  onNew,
  enabled = true,
}: UseKeyboardNavigationOptions) {
  const hotkeys = useMemo<Array<UseHotkeyDefinition>>(() => {
    const hasItems = itemCount > 0
    const registrations: Array<UseHotkeyDefinition> = []

    for (const hotkey of SHORTCUTS.navDown.hotkeys) {
      registrations.push({
        hotkey,
        callback: () => {
          if (!hasItems) return
          onSelect(selectedIndex < itemCount - 1 ? selectedIndex + 1 : 0)
        },
      })
    }

    for (const hotkey of SHORTCUTS.navUp.hotkeys) {
      registrations.push({
        hotkey,
        callback: () => {
          if (!hasItems) return
          onSelect(selectedIndex > 0 ? selectedIndex - 1 : itemCount - 1)
        },
      })
    }

    for (const hotkey of SHORTCUTS.navLeft.hotkeys) {
      registrations.push({
        hotkey,
        callback: () => {
          if (!hasItems) return
          onSelect(Math.max(0, selectedIndex - 3))
        },
      })
    }

    for (const hotkey of SHORTCUTS.navRight.hotkeys) {
      registrations.push({
        hotkey,
        callback: () => {
          if (!hasItems) return
          onSelect(Math.min(itemCount - 1, selectedIndex + 3))
        },
      })
    }

    for (const hotkey of SHORTCUTS.deselect.hotkeys) {
      registrations.push({
        hotkey,
        callback: () => onSelect(-1),
      })
    }

    if (onNew) {
      registrations.push({
        hotkey: SHORTCUTS.newIdea.hotkeys[0],
        callback: () => onNew(),
      })
    }

    if (onAction) {
      registrations.push({
        hotkey: SHORTCUTS.openActions.hotkeys[0],
        callback: () => {
          if (selectedIndex >= 0) onAction(selectedIndex)
        },
      })
    }

    return registrations
  }, [itemCount, onAction, onNew, onSelect, selectedIndex])

  useHotkeys(hotkeys, {
    enabled,
    ignoreInputs: true,
    preventDefault: true,
    stopPropagation: true,
  })

  return { selectedIndex }
}
