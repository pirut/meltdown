export type ReactionType = "been_there" | "laughing";

export interface ReactionDef {
  key: ReactionType;
  emoji: string;
  label: string;
  activeColor: string;
  activeBg: string;
}

export const REACTIONS: ReactionDef[] = [
  {
    key: "been_there",
    emoji: "\u{1F62D}",
    label: "Been There",
    activeColor: "text-blue-600",
    activeBg: "bg-blue-100",
  },
  {
    key: "laughing",
    emoji: "\u{1F923}",
    label: "Laughing",
    activeColor: "text-yellow-600",
    activeBg: "bg-yellow-100",
  },
];
