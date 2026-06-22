import { create } from "zustand"

export type TabValue = "inbox" | "archived" | "deleted"

interface UIStore {
  activeTab: TabValue
  settingsOpen: boolean
  pinnedTrayOpen: boolean
  captureOpen: boolean
  focusIdeaId: string | null
  setActiveTab: (tab: TabValue) => void
  setSettingsOpen: (open: boolean) => void
  setPinnedTrayOpen: (open: boolean) => void
  togglePinnedTray: () => void
  setCaptureOpen: (open: boolean) => void
  setFocusIdeaId: (id: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: "inbox",
  settingsOpen: false,
  pinnedTrayOpen: false,
  captureOpen: false,
  focusIdeaId: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setPinnedTrayOpen: (pinnedTrayOpen) => set({ pinnedTrayOpen }),
  togglePinnedTray: () => set((state) => ({ pinnedTrayOpen: !state.pinnedTrayOpen })),
  setCaptureOpen: (captureOpen) => set({ captureOpen }),
  setFocusIdeaId: (focusIdeaId) => set({ focusIdeaId }),
}))
