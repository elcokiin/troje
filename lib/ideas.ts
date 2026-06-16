export interface ColorOption {
  id: string | null;
  name: string;
  color: string | null;
}

export const CARD_COLORS: ColorOption[] = [
  { id: null, name: "Default", color: null },
  { id: "coral", name: "Coral", color: "oklch(0.75 0.12 25)" },
  { id: "peach", name: "Peach", color: "oklch(0.80 0.10 55)" },
  { id: "sand", name: "Sand", color: "oklch(0.85 0.06 85)" },
  { id: "mint", name: "Mint", color: "oklch(0.85 0.08 155)" },
  { id: "sage", name: "Sage", color: "oklch(0.78 0.06 145)" },
  { id: "fog", name: "Fog", color: "oklch(0.82 0.04 250)" },
  { id: "storm", name: "Storm", color: "oklch(0.70 0.06 260)" },
  { id: "dusk", name: "Dusk", color: "oklch(0.75 0.10 300)" },
  { id: "lavender", name: "Lavender", color: "oklch(0.80 0.08 290)" },
  { id: "blossom", name: "Blossom", color: "oklch(0.82 0.10 350)" },
  { id: "rose", name: "Rose", color: "oklch(0.78 0.12 10)" },
];

export function formatTimeInTrash(deletedAt: string | null): string | null {
  if (!deletedAt) return null;

  const deleted = new Date(deletedAt);
  const now = new Date();
  const diffMs = now.getTime() - deleted.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just deleted";
  if (diffMinutes < 60) return `In trash for ${diffMinutes}m`;
  if (diffHours < 24) return `In trash for ${diffHours}h`;
  if (diffDays === 1) return "In trash for 1 day";
  return `In trash for ${diffDays} days`;
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
