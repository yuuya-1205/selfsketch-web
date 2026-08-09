import { baseApi, mockDelay } from "@/lib/api/baseApi";
import type { VisionDto } from "@/data/dto/vision";

/* モック。差し替え手順は baseApi.ts のコメントを参照 */
const MOCK: VisionDto = {
  id: "v-1y",
  horizon: "1_year",
  targetDate: "2027-04-01T00:00:00Z",
  quote:
    "「毎朝の5分スケッチを312日続けたあなた。ノート3冊分の線が、迷いのない一本になっている。」",
  body: "はじめての作品集を、自分の手で綴じ終えた日。人に見せるのが怖くなくなっている。",
  progress: 0.34,
  milestones: [
    { date: "2026-06-01T00:00:00Z", title: "スケッチ100枚", reached: true },
    { date: "2026-09-01T00:00:00Z", title: "展示に1枚出す", reached: false },
    {
      date: "2026-12-01T00:00:00Z",
      title: "作品集の構成を決める",
      reached: false,
    },
    { date: "2027-04-01T00:00:00Z", title: "作品集を綴じる", reached: false },
  ],
  habits: [
    { title: "5分スケッチ", rate: 0.86 },
    { title: "好きな絵を1枚見る", rate: 0.62 },
    { title: "夜のリフレクション", rate: 0.74 },
  ],
  letter:
    "「今日うまく描けなかったことを、1年後のわたしはもう覚えていません。覚えているのは、机に向かった回数のほうです。」",
  story: [
    "朝7時。もう「描くかどうか」を迷わない。ノートを開くのは歯を磨くのと同じで、考える前に手が動いている。312日分の線が積み上がって、あなたの手はもう自分のクセを知っている。",
    "作品集を綴じた夜、いちばん気に入った一枚は、上手い絵ではなく「続けられなかった週のあと、また描き始めた日の絵」だった。",
  ],
  steps: [
    { offsetMonths: 0, title: "毎朝5分の線を残す", reached: true },
    { offsetMonths: 3, title: "100枚たまる", reached: false },
    { offsetMonths: 6, title: "得意な題材が見つかる", reached: false },
    { offsetMonths: 9, title: "展示に1枚出す", reached: false },
    { offsetMonths: 12, title: "作品集を綴じる", reached: false },
  ],
};

export const futureDataSource = baseApi.injectEndpoints({
  endpoints: (build) => ({
    vision: build.query<VisionDto, string | undefined>({
      // id 未指定は「いま表示中のビジョン」。モックは1件しかない
      queryFn: async (id) => {
        await mockDelay();
        return { data: id ? { ...MOCK, id } : MOCK };
      },
      providesTags: (_result, _error, id) => [
        { type: "Vision", id: id ?? "current" },
      ],
    }),
  }),
});
