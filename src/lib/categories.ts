export type CategoryKey =
  | "food"
  | "bedtime"
  | "getting_dressed"
  | "wrong_cup"
  | "toys"
  | "screen_time"
  | "literally_nothing"
  | "impossible_request";

export interface Category {
  key: CategoryKey;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORIES: Category[] = [
  {
    key: "food",
    emoji: "\u{1F34C}",
    label: "Food",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
  },
  {
    key: "bedtime",
    emoji: "\u{1F634}",
    label: "Bedtime",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  {
    key: "getting_dressed",
    emoji: "\u{1F455}",
    label: "Getting Dressed",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
  },
  {
    key: "wrong_cup",
    emoji: "\u{1F964}",
    label: "Wrong Cup",
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
  },
  {
    key: "toys",
    emoji: "\u{1F9E9}",
    label: "Toys",
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  {
    key: "screen_time",
    emoji: "\u{1F4FA}",
    label: "Screen Time",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-300",
  },
  {
    key: "literally_nothing",
    emoji: "\u{1F937}",
    label: "Literally Nothing",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
  },
  {
    key: "impossible_request",
    emoji: "\u{2728}",
    label: "Impossible Request",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
  },
];

export function getCategoryByKey(key: CategoryKey): Category | undefined {
  return CATEGORIES.find((c) => c.key === key);
}
