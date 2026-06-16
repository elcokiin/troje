export interface Idea {
  id: string;
  content: string;
  source: "web" | "telegram" | "api";
  status: "inbox" | "archived" | "deleted";
  tags: string[] | null;
  pinned: boolean;
  background_color: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type IdeaStatus = "inbox" | "archived" | "deleted";
export type IdeaSource = "web" | "telegram" | "api";

export interface IdeaCardProps {
  idea: Idea;
  onStatusChange: (id: string, status: IdeaStatus) => void;
  onPinChange: (id: string, pinned: boolean) => void;
  onColorChange: (id: string, color: string | null) => void;
  onPermanentDelete?: (id: string) => void;
  isSelected?: boolean;
  showTrashInfo?: boolean;
}
