"use client"

import { useState, useEffect, useCallback } from "react"

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
    setDebouncedSearch("")
  }, [])

  return { searchQuery, setSearchQuery, debouncedSearch, handleClearSearch }
}
