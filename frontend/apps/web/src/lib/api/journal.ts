import { baseApi, mockDelay } from "./baseApi";
import type { JournalEntry } from "./types";

const ENTRIES: JournalEntry[] = [
  {
    id: "jn-0422",
    dateLabel: "4月22日 (火)",
    timeLabel: "2026年4月22日 (火) · 7:32",
    title: "線が迷わなくなってきた",
    excerpt: "手首から動かす感覚がわかった気がする。5分の予定が15分に。",
    body: [
      "手首から動かす感覚が、やっと少しわかった気がする。今までは指先だけで描こうとしていたから、線が細切れになっていた。今日は肩から腕、手首へ力が抜けていって、一本の線がすっと引けた。",
      "5分だけのつもりが15分。楽しくなってしまった日は、そのまま描いていいことにしている。無理に止めると、次の日に「またやらされる」感じが残るから。",
    ],
    moodColor: "#8b6f47",
    hasImage: true,
    habit: "5分スケッチ",
    mood: "気分: 穏やか",
    tags: ["#継続14日目", "#朝"],
    quote: "「うまく描けない日も、線は残る。」— 今日のひとこと",
    stats: ["習慣 4/5 達成", "気分スコア 4.2", "スケッチ 1枚"],
  },
  {
    id: "jn-0421",
    dateLabel: "4月21日 (月)",
    timeLabel: "2026年4月21日 (月) · 7:48",
    title: "朝の光がよかった",
    excerpt: "窓際で描いたら、影の付け方が自然に。",
    body: [
      "窓際で描いたら、影の付け方が自然になった。光の向きが決まっていると、迷う時間が減る。",
      "場所を変えるだけで結果が変わるなら、意志の力の話じゃない。",
    ],
    moodColor: "#c9a87c",
    hasImage: false,
    habit: "5分スケッチ",
    mood: "気分: 明るい",
    tags: ["#朝"],
    quote: "「机より、窓のほうが大事な日もある。」",
    stats: ["習慣 5/5 達成", "気分スコア 4.6", "スケッチ 1枚"],
  },
  {
    id: "jn-0420",
    dateLabel: "4月20日 (日)",
    timeLabel: "2026年4月20日 (日) · 22:10",
    title: "眠くて雑な日",
    excerpt: "でも、描いた事実は残る。ゼロじゃない。",
    body: [
      "眠くて雑だった。線もよれている。",
      "でも、描いた事実は残る。ゼロじゃない日を積むほうが、たまに完璧にやるより効いている気がする。",
    ],
    moodColor: "#a68960",
    hasImage: false,
    habit: "5分スケッチ",
    mood: "気分: 眠い",
    tags: ["#夜"],
    quote: "「ゼロじゃない日を積む。」",
    stats: ["習慣 3/5 達成", "気分スコア 3.1", "スケッチ 1枚"],
  },
  {
    id: "jn-0419",
    dateLabel: "4月19日 (土)",
    timeLabel: "2026年4月19日 (土) · 11:02",
    title: "1年後の自分を見返した",
    excerpt: "3か月前より、ずいぶん近づいている。",
    body: [
      "1年後の自分のページを見返した。3か月前に読んだときは他人事だったのに、今日は「あと少し」に見えた。",
      "距離が縮まったというより、解像度が上がった感じ。",
    ],
    moodColor: "#8b6f47",
    hasImage: true,
    habit: "好きな絵を1枚見る",
    mood: "気分: 前向き",
    tags: ["#未来の自分"],
    quote: "「他人事が、あと少しに変わる日。」",
    stats: ["習慣 4/5 達成", "気分スコア 4.4", "スケッチ 2枚"],
  },
  {
    id: "jn-0418",
    dateLabel: "4月18日 (金)",
    timeLabel: "2026年4月18日 (金) · 23:40",
    title: "手が止まった日",
    excerpt: "5分だけ。それでいいと決めた。",
    body: [
      "何も思いつかなくて、10分ぐらい紙を眺めていた。",
      "結局、いつものコップを描いた。5分だけ。それでいいと決めた日。",
    ],
    moodColor: "#d4b896",
    hasImage: false,
    habit: "5分スケッチ",
    mood: "気分: 停滞",
    tags: ["#夜"],
    quote: "「描けない日の記録も、記録。」",
    stats: ["習慣 2/5 達成", "気分スコア 2.8", "スケッチ 1枚"],
  },
];

export const JOURNAL_FILTERS = [
  "すべて",
  "今週",
  "お気に入り",
  "習慣別",
] as const;

export const journalApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    journalEntries: build.query<JournalEntry[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: ENTRIES };
      },
      providesTags: (result) => [
        "Journal",
        ...(result ?? []).map((e) => ({ type: "Journal" as const, id: e.id })),
      ],
    }),
  }),
});

export const { useJournalEntriesQuery } = journalApi;
