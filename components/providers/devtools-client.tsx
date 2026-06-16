'use client'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { hotkeysDevtoolsPlugin } from '@tanstack/react-hotkeys-devtools'

export function DevtoolsClient() {
  if (process.env.NODE_ENV !== 'development') return null
  return <TanStackDevtools plugins={[hotkeysDevtoolsPlugin()]} />
}
