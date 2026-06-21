"use client";

import { Pin, Search, Settings, X } from "lucide-react";
import type { RefObject } from "react";
import { Kbd } from "@/components/ui/kbd";
import { useShortcutPreference } from "@/hooks/use-shortcut-preferences";

export interface SearchState {
  searchMode: boolean;
  setSearchMode: (mode: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearch: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  handleCloseSearch: () => void;
  handleXClick: () => void;
}

interface BottomNavProps {
  onSettingsOpen: () => void;
  search: SearchState;
}

export function BottomNav({ onSettingsOpen, search }: BottomNavProps) {
  const [showShortcutHints] = useShortcutPreference("troje-shortcut-hints");
  const {
    searchMode,
    setSearchMode,
    searchQuery,
    setSearchQuery,
    searchInputRef,
    handleCloseSearch,
    handleXClick,
  } = search;

  return (
    <nav className="shrink-0 h-12 border-t bg-background flex items-stretch">
      {searchMode ? (
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find your ideas..."
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCloseSearch();
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            onClick={handleXClick}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={searchQuery ? "Clear search" : "Close search"}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <>
          <button className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full gap-0.5">
            <Pin className="size-[14px]" />
            <span className="flex items-center gap-1 text-[10px] font-medium leading-tight">
              Pin
              {showShortcutHints && <Kbd className="h-3.5 min-w-3.5 text-[8px] px-0.5">P</Kbd>}
            </span>
          </button>
          <button
            onClick={() => setSearchMode(true)}
            className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-x border-dashed border-muted-foreground h-full gap-0.5"
          >
            <Search className="size-[14px]" />
            <span className="flex items-center gap-1 text-[10px] font-medium leading-tight">
              Search
              {showShortcutHints && <Kbd className="h-3.5 min-w-3.5 text-[8px] px-0.5">F</Kbd>}
            </span>
          </button>
          <button
            onClick={onSettingsOpen}
            className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full gap-0.5"
          >
            <Settings className="size-[14px]" />
            <span className="flex items-center gap-1 text-[10px] font-medium leading-tight">
              Settings
              {showShortcutHints && <Kbd className="h-3.5 min-w-3.5 text-[8px] px-0.5">S</Kbd>}
            </span>
          </button>
        </>
      )}
    </nav>
  );
}
