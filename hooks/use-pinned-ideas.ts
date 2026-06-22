"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import type { Idea } from "@/types/idea"

export function usePinnedIdeas() {
  const { data, error, isLoading, mutate } = useSWR<{ ideas: Idea[] }>(
    "/api/ideas?pinned=true",
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      focusThrottleInterval: 10_000,
    }
  )

  return {
    ideas: data?.ideas ?? [],
    error,
    isLoading,
    mutate,
  }
}
