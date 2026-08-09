import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { JournalEntryDto } from "@/data/dto/journal";

/* モック。差し替え手順は baseApi.ts のコメントを参照 */
const MOCK: JournalEntryDto[] = [
  {
    id: "jn-0422",
    writtenAt: "2026-04-21T22:32:00Z",
    title: "線が迷わなくなってきた",
    excerpt: "手首から動かす感覚がわかった気がする。5分の予定が15分に。",
    body: [
      "手首から動かす感覚が、やっと少しわかった気がする。今までは指先だけで描こうとしていたから、線が細切れになっていた。今日は肩から腕、手首へ力が抜けていって、一本の線がすっと引けた。",
      "5分だけのつもりが15分。楽しくなってしまった日は、そのまま描いていいことにしている。無理に止めると、次の日に「またやらされる」感じが残るから。",
    ],
    hasImage: true,
    habitTitle: "5分スケッチ",
    mood: "calm",
    tags: ["継続14日目", "朝"],
    quote: "「うまく描けない日も、線は残る。」",
    stats: {
      habitsCompleted: 4,
      habitsTotal: 5,
      moodScore: 4.2,
      sketchCount: 1,
    },
  },
  {
    id: "jn-0421",
    writtenAt: "2026-04-20T22:48:00Z",
    title: "朝の光がよかった",
    excerpt: "窓際で描いたら、影の付け方が自然に。",
    body: [
      "窓際で描いたら、影の付け方が自然になった。光の向きが決まっていると、迷う時間が減る。",
      "場所を変えるだけで結果が変わるなら、意志の力の話じゃない。",
    ],
    hasImage: false,
    habitTitle: "5分スケッチ",
    mood: "bright",
    tags: ["朝"],
    quote: "「机より、窓のほうが大事な日もある。」",
    stats: {
      habitsCompleted: 5,
      habitsTotal: 5,
      moodScore: 4.6,
      sketchCount: 1,
    },
  },
  {
    id: "jn-0420",
    writtenAt: "2026-04-20T13:10:00Z",
    title: "眠くて雑な日",
    excerpt: "でも、描いた事実は残る。ゼロじゃない。",
    body: [
      "眠くて雑だった。線もよれている。",
      "でも、描いた事実は残る。ゼロじゃない日を積むほうが、たまに完璧にやるより効いている気がする。",
    ],
    hasImage: false,
    habitTitle: "5分スケッチ",
    mood: "sleepy",
    tags: ["夜"],
    quote: "「ゼロじゃない日を積む。」",
    stats: {
      habitsCompleted: 3,
      habitsTotal: 5,
      moodScore: 3.1,
      sketchCount: 1,
    },
  },
  {
    id: "jn-0419",
    writtenAt: "2026-04-19T02:02:00Z",
    title: "1年後の自分を見返した",
    excerpt: "3か月前より、ずいぶん近づいている。",
    body: [
      "1年後の自分のページを見返した。3か月前に読んだときは他人事だったのに、今日は「あと少し」に見えた。",
      "距離が縮まったというより、解像度が上がった感じ。",
    ],
    hasImage: true,
    habitTitle: "好きな絵を1枚見る",
    mood: "positive",
    tags: ["未来の自分"],
    quote: "「他人事が、あと少しに変わる日。」",
    stats: {
      habitsCompleted: 4,
      habitsTotal: 5,
      moodScore: 4.4,
      sketchCount: 2,
    },
  },
  {
    id: "jn-0418",
    writtenAt: "2026-04-18T14:40:00Z",
    title: "手が止まった日",
    excerpt: "5分だけ。それでいいと決めた。",
    body: [
      "何も思いつかなくて、10分ぐらい紙を眺めていた。",
      "結局、いつものコップを描いた。5分だけ。それでいいと決めた日。",
    ],
    hasImage: false,
    habitTitle: "5分スケッチ",
    mood: "stuck",
    tags: ["夜"],
    quote: "「描けない日の記録も、記録。」",
    stats: {
      habitsCompleted: 2,
      habitsTotal: 5,
      moodScore: 2.8,
      sketchCount: 1,
    },
  },
];

export const journalDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    journalEntries: build.query<JournalEntryDto[], void>({
      queryFn: async () => {
        await mockDelay();
        return { data: MOCK };
      },
      providesTags: (result) => [
        "Journal",
        ...(result ?? []).map((e) => ({ type: "Journal" as const, id: e.id })),
      ],
    }),
  }),
});
