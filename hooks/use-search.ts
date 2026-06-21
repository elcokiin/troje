"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useSearch() {
  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (searchMode && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchMode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const isSearchShortcut =
        (e.key.toLowerCase() === "f" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey)
      if (isSearchShortcut) {
        e.preventDefault()
        setSearchMode((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setSearchMode(false)
    setSearchQuery("")
    setDebouncedSearch("")
  }, [])

  const handleXClick = useCallback(() => {
    if (searchQuery) {
      setSearchQuery("")
    } else {
      handleCloseSearch()
    }
  }, [searchQuery, handleCloseSearch])

  return {
    searchMode,
    setSearchMode,
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    searchInputRef,
    handleCloseSearch,
    handleXClick,
  }
}
