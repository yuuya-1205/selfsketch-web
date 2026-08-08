import { useMockQuery } from "./client";
import type {
  BackcastStep,
  ComparisonSide,
  ReflectionEntryPoint,
  TimelineNode,
} from "./types";

export const REFLECTION_ENTRIES: ReflectionEntryPoint[] = [
  {
    to: "/reflection/daily",
    icon: "sunrise",
    title: "今日のリフレクション",
    description: "3つの問いに答えて、1日を締めくくる",
    lastUsed: "昨日 22:14",
  },
  {
    to: "/reflection/compare",
    icon: "git-compare",
    title: "6か月前の自分と比べる",
    description: "記録・作品・言葉の変化を並べて見る",
    lastUsed: "3日前",
  },
  {
    to: "/reflection/timeline",
    icon: "milestone",
    title: "未来タイムライン",
    description: "1年 / 3年 / 10年の自分を一本の線で見る",
    lastUsed: "先週",
  },
  {
    to: "/reflection/century",
    icon: "infinity",
    title: "100年ライフ",
    description: "人生を100マスにして、いまの位置を確かめる",
    lastUsed: "未実施",
  },
  {
    to: "/reflection/backcast",
    icon: "route",
    title: "逆算プラン",
    description: "10年後から今日までを逆算して分解する",
    lastUsed: "2週間前",
  },
  {
    to: "/reflection/vision",
    icon: "layout-grid",
    title: "ビジョンボード",
    description: "なりたい姿を1枚のボードにまとめる",
    lastUsed: "先月",
  },
];

export const DAILY_QUESTIONS = [
  {
    no: "Q1",
    question: "今日、いちばん自分らしかった瞬間は？",
    answer:
      "朝、誰にも見せない一枚を描いていたとき。うまくはないけど、手が止まらなかった。",
  },
  {
    no: "Q2",
    question: "うまくいかなかったことは？ それでも残ったものは？",
    answer: "夜のリフレクションを忘れかけた。でも寝る前に思い出して開いた。",
  },
  {
    no: "Q3",
    question: "明日の自分に、ひとつだけ渡すとしたら？",
    answer: "",
  },
];

export const COMPARISON: [ComparisonSide, ComparisonSide] = [
  {
    label: "BEFORE",
    dateLabel: "2025年10月",
    quote: "「3日で終わりそう。でも一応はじめてみる。」",
    stats: [
      { label: "記録日", value: "6日" },
      { label: "連続", value: "2日" },
      { label: "作品", value: "4点" },
    ],
  },
  {
    label: "NOW",
    dateLabel: "2026年4月",
    quote: "「描けない日にこそ、机に座る意味がある気がした。」",
    stats: [
      { label: "記録日", value: "26日" },
      { label: "連続", value: "14日" },
      { label: "作品", value: "12点" },
    ],
  },
];

export const COMPARISON_DELTAS = [
  { label: "記録日数", value: "+333%" },
  { label: "再開までの日数", value: "-82%" },
  { label: "作品数", value: "+200%" },
];

export const TIMELINE_NODES: TimelineNode[] = [
  { horizon: "いま", year: "2026", title: "5分スケッチを14日継続", seed: 0, isNow: true },
  { horizon: "6か月", year: "2026.10", title: "100枚たまり、得意が見える", seed: 1, isNow: false },
  { horizon: "1年", year: "2027.04", title: "作品集を綴じる", seed: 2, isNow: false },
  { horizon: "3年", year: "2029", title: "展示に出す側になる", seed: 3, isNow: false },
  { horizon: "5年", year: "2031", title: "教える立場になる", seed: 4, isNow: false },
  { horizon: "10年", year: "2036", title: "自分の線が仕事になる", seed: 5, isNow: false },
];

export const BACKCAST_STEPS: BackcastStep[] = [
  {
    horizon: "10年後",
    year: "2036年",
    goal: "自分の線が仕事になっている",
    items: ["個展を年1回ひらく", "絵で生活費の半分を得る", "教える側にまわる"],
    primary: true,
  },
  {
    horizon: "3年後",
    year: "2029年",
    goal: "展示に出す側になる",
    items: ["公募展に3回出す", "作品を50点そろえる", "SNSで発表を続ける"],
    primary: false,
  },
  {
    horizon: "1年後",
    year: "2027年",
    goal: "作品集を綴じる",
    items: ["100枚のスケッチ", "得意な題材を3つ決める", "製本の方法を学ぶ"],
    primary: false,
  },
  {
    horizon: "今月",
    year: "2026年4月",
    goal: "描く日を26日つくる",
    items: ["毎朝7時に5分", "週末は15分版", "日曜に1週間分を見返す"],
    primary: false,
  },
];

export const WEEK_TASKS = [
  { label: "毎朝7時に5分描く", done: true },
  { label: "日曜に1週間分を見返す", done: false },
  { label: "得意な題材を1つメモする", done: false },
];

export const CENTURY = {
  age: 32,
  total: 100,
  stats: [
    { label: "すごした年", value: "32年 / 11,688日" },
    { label: "これからの年", value: "68年 / 24,837日" },
    { label: "5分 × 残りの日数", value: "2,069時間" },
  ],
  note: "5分スケッチを1年続けると、残り68マスのうち67マスに「描ける自分」で入ることになります。",
  quote: "「1マスは、365回の today でできている。」",
};

export const VISION_BOARD = {
  words: ["続ける", "一本の線", "静かな朝", "見せられる自分"],
  quote: "「上手くなるためではなく、\n続けた自分に会うために描く。」",
  values: ["完璧より、頻度", "比べるのは半年前の自分", "休んでも、戻る"],
};

export const CLOSING = {
  dateLabel: "2026年4月22日 (火) · 22:40",
  title: "今日はここまで。",
  summary:
    "4つの習慣、15分のスケッチ、1本のジャーナル。\n14日目のあなたが、今日も机に座りました。",
  stats: [
    { label: "習慣", value: "4 / 5" },
    { label: "スケッチ", value: "15分" },
    { label: "連続", value: "14日" },
    { label: "ことば", value: "312字" },
  ],
  tomorrow: "「7時に、机に座るだけでいい。」",
};

export function useReflectionEntries() {
  return useMockQuery(["reflection", "entries"], REFLECTION_ENTRIES);
}
