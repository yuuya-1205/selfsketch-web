import { baseApi, mockDelay } from "./baseApi";
import type { Vision } from "./types";

const VISION: Vision = {
  id: "v-1y",
  horizon: "1年",
  dateLabel: "2027年4月",
  quote:
    "「毎朝の5分スケッチを312日続けたあなた。ノート3冊分の線が、迷いのない一本になっている。」",
  body: "はじめての作品集を、自分の手で綴じ終えた日。人に見せるのが怖くなくなっている。",
  progress: 0.34,
  remainingDays: 312,
  milestones: [
    { when: "6月", title: "スケッチ100枚", reached: true },
    { when: "9月", title: "展示に1枚出す", reached: false },
    { when: "12月", title: "作品集の構成を決める", reached: false },
    { when: "4月", title: "作品集を綴じる", reached: false },
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
    { when: "いま", title: "毎朝5分の線を残す", reached: true },
    { when: "3か月後", title: "100枚たまる", reached: false },
    { when: "6か月後", title: "得意な題材が見つかる", reached: false },
    { when: "9か月後", title: "展示に1枚出す", reached: false },
    { when: "1年後", title: "作品集を綴じる", reached: false },
  ],
};

export const HORIZONS = ["6か月", "1年", "3年", "10年"] as const;

export const futureApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // id 未指定は「いま表示中のビジョン」。モックは1件しかない
    vision: build.query<Vision, string | undefined>({
      queryFn: async (id) => {
        await mockDelay();
        return { data: id ? { ...VISION, id } : VISION };
      },
      providesTags: (_result, _error, id) => [
        { type: "Vision", id: id ?? "current" },
      ],
    }),
  }),
});

export const { useVisionQuery } = futureApi;
