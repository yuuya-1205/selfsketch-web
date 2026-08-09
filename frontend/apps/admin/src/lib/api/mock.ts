/**
 * 管理コンソールのモックデータ。
 *
 * 実装後は以下の系統に置き換わる想定（selfsketch.pen の「A5. 設計メモ」参照）:
 *   - KPI / ファネル      -> BigQuery の日次集計テーブル
 *   - ユーザー・記録メタ  -> Firestore（本文は取得しない）
 *   - 課金               -> Stripe Webhook + 日次同期
 *   - AI メトリクス       -> 生成プロキシのメトリクス
 *   - 通報               -> アプリ内通報 + 自動検知スコア
 */

export type Tone = "ok" | "warn" | "danger" | "muted";

/* ---- A1 概要 ------------------------------------------------------- */

export const ALERTS = [
  {
    icon: "shield-alert",
    label: "未処理の通報が 12件（うち緊急 2件）",
    tone: "danger" as Tone,
    cta: "対応する",
    to: "/moderation",
  },
  {
    icon: "cpu",
    label: "AI生成の失敗率 4.2%（閾値 3%）",
    tone: "warn" as Tone,
    cta: "調べる",
    to: "/ai",
  },
  {
    icon: "credit-card",
    label: "決済エラー 3件",
    tone: "warn" as Tone,
    cta: "確認",
    to: "/revenue",
  },
];

export const KPIS = [
  { label: "DAU", value: "4,182", delta: "+6.2%", up: true },
  { label: "WAU", value: "11,940", delta: "+3.8%", up: true },
  { label: "MAU", value: "28,610", delta: "+1.4%", up: true },
  { label: "新規登録", value: "312", delta: "-8.1%", up: false },
  { label: "D7継続率", value: "41.6%", delta: "+2.2pt", up: true },
  { label: "MRR", value: "¥3.42M", delta: "+4.9%", up: true },
];

export const DAU_SERIES = [
  62, 68, 71, 65, 58, 49, 52, 70, 74, 72, 69, 60, 55, 73, 78, 76, 74, 66, 58,
  77, 81, 79, 75, 68, 61, 80, 84, 82, 79, 86,
];

export const FUNNEL = [
  { label: "登録完了", count: "312", rate: 1 },
  { label: "目標を入力", count: "281", rate: 0.901 },
  { label: "AI未来を生成", count: "244", rate: 0.782 },
  { label: "最初の習慣を設定", count: "208", rate: 0.667 },
  { label: "初回記録", count: "171", rate: 0.548 },
  { label: "7日継続", count: "130", rate: 0.416 },
];

export const EVENTS = [
  {
    time: "12:41",
    text: "AI生成 タイムアウト率が上昇（gpt-image / 4.2%）",
    tone: "warn" as Tone,
  },
  {
    time: "12:08",
    text: "通報を受理：作品ID art_88213（自傷表現の疑い）",
    tone: "danger" as Tone,
  },
  {
    time: "11:52",
    text: "sato@ が user_10412 のアカウントを一時停止",
    tone: "muted" as Tone,
  },
  {
    time: "11:30",
    text: "4月の月次レポート配信を完了（28,610通）",
    tone: "ok" as Tone,
  },
  {
    time: "10:14",
    text: "決済リトライに失敗：sub_2291（カード期限切れ）",
    tone: "warn" as Tone,
  },
];

/* ---- A2 ユーザー --------------------------------------------------- */

export const USER_FILTERS = [
  "すべて",
  "アクティブ",
  "休眠 30日+",
  "停止中",
  "課金中",
];

export interface AdminUser {
  id: string;
  initial: string;
  name: string;
  email: string;
  plan: "Free" | "Premium";
  registered: string;
  lastRecord: string;
  streak: string;
  records: string;
  status: string;
  tone: Tone;
}

export const USERS: AdminUser[] = [
  {
    id: "user_10412",
    initial: "ゆ",
    name: "ゆうき",
    email: "yuki@example.com",
    plan: "Premium",
    registered: "2025/11/02",
    lastRecord: "2分前",
    streak: "14日",
    records: "148",
    status: "アクティブ",
    tone: "ok",
  },
  {
    id: "user_10233",
    initial: "み",
    name: "みお",
    email: "mio@example.com",
    plan: "Premium",
    registered: "2025/08/14",
    lastRecord: "1時間前",
    streak: "31日",
    records: "402",
    status: "アクティブ",
    tone: "ok",
  },
  {
    id: "user_11890",
    initial: "け",
    name: "けんた",
    email: "kenta@example.com",
    plan: "Free",
    registered: "2026/01/09",
    lastRecord: "今日 08:12",
    streak: "30日",
    records: "96",
    status: "アクティブ",
    tone: "ok",
  },
  {
    id: "user_10998",
    initial: "さ",
    name: "さやか",
    email: "sayaka@example.com",
    plan: "Free",
    registered: "2025/12/21",
    lastRecord: "3日前",
    streak: "0日",
    records: "54",
    status: "休眠 3日",
    tone: "muted",
  },
  {
    id: "user_20114",
    initial: "ゆ",
    name: "ゆい",
    email: "yui@example.com",
    plan: "Free",
    registered: "2025/05/30",
    lastRecord: "昨日",
    streak: "1日",
    records: "211",
    status: "復帰",
    tone: "warn",
  },
  {
    id: "user_09001",
    initial: "は",
    name: "はると",
    email: "haruto@example.com",
    plan: "Premium",
    registered: "2024/09/12",
    lastRecord: "1分前",
    streak: "112日",
    records: "1,204",
    status: "アクティブ",
    tone: "ok",
  },
  {
    id: "user_31002",
    initial: "あ",
    name: "あおい",
    email: "aoi@example.com",
    plan: "Free",
    registered: "2026/03/02",
    lastRecord: "42日前",
    streak: "0日",
    records: "9",
    status: "休眠 42日",
    tone: "muted",
  },
  {
    id: "user_31877",
    initial: "れ",
    name: "れん",
    email: "ren@example.com",
    plan: "Free",
    registered: "2026/04/18",
    lastRecord: "4日前",
    streak: "2日",
    records: "6",
    status: "新規",
    tone: "warn",
  },
  {
    id: "user_10555",
    initial: "ひ",
    name: "ひなた",
    email: "hinata@example.com",
    plan: "Premium",
    registered: "2025/02/11",
    lastRecord: "今日 07:40",
    streak: "67日",
    records: "688",
    status: "アクティブ",
    tone: "ok",
  },
  {
    id: "user_10777",
    initial: "そ",
    name: "そうた",
    email: "sota@example.com",
    plan: "Free",
    registered: "2025/07/07",
    lastRecord: "—",
    streak: "0日",
    records: "31",
    status: "停止中",
    tone: "danger",
  },
];

/* ---- A3 ユーザー詳細 ----------------------------------------------- */

export const USER_DETAIL = {
  profile: [
    ["表示名", "ゆうき"],
    ["メール", "yuki@example.com"],
    ["言語 / TZ", "日本語 / GMT+9"],
    ["連携", "Google"],
    ["最終ログイン", "2分前 (Web / Chrome)"],
  ],
  billing: [
    ["プラン", "Premium 年額"],
    ["次回請求", "2027/01/12"],
    ["LTV", "¥19,600"],
    ["支払い方法", "Visa •••• 4242"],
  ],
  devices: [
    { name: "Chrome / macOS", meta: "2分前 · 東京", active: true },
    { name: "iPhone アプリ", meta: "昨日 22:10 · 東京", active: false },
    { name: "iPad Safari", meta: "4/14 · 大阪", active: false },
  ],
  stats: [
    { label: "記録数", value: "148" },
    { label: "連続", value: "14日" },
    { label: "最長", value: "21日" },
    { label: "作品", value: "42点" },
    { label: "AI生成", value: "9回" },
    { label: "フレンド", value: "8人" },
  ],
  support: [
    {
      date: "2026/04/12",
      title: "AI生成が途中で止まる",
      status: "解決済",
      tone: "ok" as Tone,
    },
    {
      date: "2026/02/03",
      title: "年額プランへの変更方法",
      status: "解決済",
      tone: "ok" as Tone,
    },
    {
      date: "2025/12/18",
      title: "データ書き出しの依頼",
      status: "対応中",
      tone: "warn" as Tone,
    },
  ],
};

/* ---- A4 コンテンツ審査 --------------------------------------------- */

export const MODERATION_FILTERS = [
  "緊急のみ",
  "自傷・危険",
  "著作権",
  "スパム",
  "すべて",
];

export interface Report {
  id: string;
  severity: "緊急" | "通常";
  title: string;
  target: string;
  count: string;
  time: string;
  tone: Tone;
}

export const REPORTS: Report[] = [
  {
    id: "rep_2201",
    severity: "緊急",
    title: "自傷表現の疑い",
    target: "作品 art_88213 · ゆい",
    count: "3件の通報",
    time: "12分前",
    tone: "danger",
  },
  {
    id: "rep_2200",
    severity: "緊急",
    title: "他者の作品の無断掲載",
    target: "作品 art_88190 · そうた",
    count: "1件の通報",
    time: "41分前",
    tone: "danger",
  },
  {
    id: "rep_2198",
    severity: "通常",
    title: "スパム / 宣伝リンク",
    target: "ジャーナル jn_5521 · れん",
    count: "2件の通報",
    time: "2時間前",
    tone: "warn",
  },
  {
    id: "rep_2195",
    severity: "通常",
    title: "不適切な表現",
    target: "コメント cm_1180 · あおい",
    count: "1件の通報",
    time: "3時間前",
    tone: "warn",
  },
  {
    id: "rep_2190",
    severity: "通常",
    title: "なりすましの疑い",
    target: "プロフィール user_20114",
    count: "1件の通報",
    time: "5時間前",
    tone: "muted",
  },
  {
    id: "rep_2188",
    severity: "通常",
    title: "スパム / 宣伝リンク",
    target: "シェア sh_3390 · はると",
    count: "4件の通報",
    time: "8時間前",
    tone: "warn",
  },
];

export const REPORT_REASONS = [
  { label: "自傷・自殺のほのめかし", count: "2件", tone: "danger" as Tone },
  { label: "暴力的な表現", count: "1件", tone: "warn" as Tone },
  {
    label: "自動検知スコア: 0.82（閾値 0.75）",
    count: "",
    tone: "danger" as Tone,
  },
];

export const MODERATION_ACTIONS = [
  { label: "問題なし（棄却）", tone: "muted" as Tone },
  { label: "相談窓口を案内", tone: "warn" as Tone },
  { label: "限定公開にする", tone: "warn" as Tone },
  { label: "非公開にする", tone: "danger" as Tone },
  { label: "アカウント停止", tone: "danger" as Tone },
];

/* ---- A5 AI モニタリング -------------------------------------------- */

export const AI_KPIS = [
  {
    label: "生成リクエスト",
    value: "18,402",
    note: "今月",
    tone: "muted" as Tone,
  },
  { label: "成功率", value: "95.8%", note: "-1.2pt", tone: "warn" as Tone },
  {
    label: "p95 レイテンシ",
    value: "7.4s",
    note: "+0.9s",
    tone: "warn" as Tone,
  },
  {
    label: "今月のコスト",
    value: "¥412,800",
    note: "予算の 68%",
    tone: "muted" as Tone,
  },
  {
    label: "1ユーザーあたり",
    value: "¥14.4",
    note: "-¥1.2",
    tone: "ok" as Tone,
  },
  {
    label: "安全ブロック",
    value: "126件",
    note: "0.7%",
    tone: "muted" as Tone,
  },
];

export const AI_HOURLY = [
  12, 8, 5, 3, 2, 6, 28, 64, 52, 38, 30, 26, 34, 29, 25, 22, 31, 44, 58, 72, 86,
  64, 38, 20,
];
export const AI_HOURLY_FAIL = [
  1, 0, 0, 0, 0, 0, 2, 4, 3, 2, 1, 1, 2, 1, 1, 1, 2, 3, 5, 9, 12, 6, 2, 1,
];

export const AI_FAIL_REASONS = [
  {
    label: "タイムアウト (>30s)",
    count: 412,
    rate: 0.53,
    tone: "danger" as Tone,
  },
  { label: "レート制限", count: 188, rate: 0.24, tone: "warn" as Tone },
  { label: "安全フィルタ", count: 126, rate: 0.16, tone: "muted" as Tone },
  { label: "不正な入力", count: 48, rate: 0.07, tone: "muted" as Tone },
];

export const AI_SAFETY = [
  { label: "自傷・危険な内容", count: "64件" },
  { label: "実在人物の顔", count: "31件" },
  { label: "暴力表現", count: "19件" },
  { label: "その他", count: "12件" },
];

export const AI_MODELS = [
  {
    name: "image-gen-v3 / 未来の自分の画像",
    requests: "6,204",
    rate: "93.1%",
    p95: "11.2s",
    unit: "¥42",
    cost: "¥260,568",
    status: "要注意",
    tone: "warn" as Tone,
  },
  {
    name: "text-story-v2 / 未来の物語",
    requests: "7,880",
    rate: "98.4%",
    p95: "3.1s",
    unit: "¥12",
    cost: "¥94,560",
    status: "正常",
    tone: "ok" as Tone,
  },
  {
    name: "summarize-v1 / 月次レポート",
    requests: "3,102",
    rate: "99.2%",
    p95: "2.4s",
    unit: "¥14",
    cost: "¥43,428",
    status: "正常",
    tone: "ok" as Tone,
  },
  {
    name: "moderation-v2 / 安全判定",
    requests: "1,216",
    rate: "99.9%",
    p95: "0.6s",
    unit: "¥11",
    cost: "¥13,376",
    status: "正常",
    tone: "ok" as Tone,
  },
];

/* ---- A6 売上・課金 -------------------------------------------------- */

export const REVENUE_KPIS = [
  { label: "MRR", value: "¥3,420,000", delta: "+4.9%", up: true },
  { label: "ARR（年換算）", value: "¥41.0M", delta: "+6.1%", up: true },
  { label: "有料会員", value: "3,489人", delta: "+128", up: true },
  { label: "課金率", value: "12.2%", delta: "+0.4pt", up: true },
  { label: "ARPU", value: "¥980", delta: "±0", up: true },
  { label: "解約率", value: "2.8%", delta: "+0.3pt", up: false },
];

export const MRR_SERIES = [
  188, 206, 224, 241, 258, 272, 288, 301, 316, 329, 341, 342,
];
export const MONTH_LABELS = [
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
  "1月",
  "2月",
  "3月",
  "4月",
];

export const PLAN_MIX = [
  {
    label: "年額プラン",
    detail: "1,814人 · 52%",
    ratio: 0.52,
    color: "#3d2817",
  },
  {
    label: "月額プラン",
    detail: "1,256人 · 36%",
    ratio: 0.36,
    color: "#8b6f47",
  },
  {
    label: "無料トライアル",
    detail: "419人 · 12%",
    ratio: 0.12,
    color: "#d4b896",
  },
];

export const CHURN_REASONS = [
  { label: "続けられなかった", count: 41 },
  { label: "価格が高い", count: 26 },
  { label: "機能が足りない", count: 18 },
  { label: "その他", count: 13 },
];

export const BILLING_ISSUES = [
  {
    id: "sub_2291",
    user: "ゆい",
    detail: "カード期限切れ · 3回リトライ失敗",
    amount: "¥980",
    date: "4/20",
    status: "要対応",
    tone: "danger" as Tone,
  },
  {
    id: "sub_1180",
    user: "そうた",
    detail: "返金申請（誤課金の申告）",
    amount: "¥9,800",
    date: "4/19",
    status: "確認中",
    tone: "warn" as Tone,
  },
  {
    id: "sub_3320",
    user: "あおい",
    detail: "チャージバック申請",
    amount: "¥980",
    date: "4/18",
    status: "調査中",
    tone: "warn" as Tone,
  },
  {
    id: "sub_0912",
    user: "れん",
    detail: "二重課金の可能性",
    amount: "¥1,960",
    date: "4/17",
    status: "返金済",
    tone: "ok" as Tone,
  },
];

/* ---- A7 配信 -------------------------------------------------------- */

export const CAMPAIGNS = [
  {
    name: "4月の月次レポートができました",
    channel: "メール",
    target: "全ユーザー",
    when: "4/01 09:00",
    rate: "28,610 / 46.2%",
    status: "配信済",
    tone: "ok" as Tone,
  },
  {
    name: "3日空いた方へ：5分だけ戻りませんか",
    channel: "プッシュ",
    target: "休眠 3–7日",
    when: "毎日 20:00",
    rate: "1,204 / 31.8%",
    status: "定期配信",
    tone: "ok" as Tone,
  },
  {
    name: "Premium 7日間無料キャンペーン",
    channel: "メール",
    target: "無料・課金意向あり",
    when: "4/24 10:00",
    rate: "— / —",
    status: "予約済",
    tone: "warn" as Tone,
  },
  {
    name: "新機能：Web版をリリースしました",
    channel: "アプリ内",
    target: "全ユーザー",
    when: "4/22 12:00",
    rate: "11,940 / 68.4%",
    status: "配信中",
    tone: "warn" as Tone,
  },
  {
    name: "14日連続おめでとうございます",
    channel: "プッシュ",
    target: "達成トリガー",
    when: "イベント時",
    rate: "自動 / 52.1%",
    status: "自動配信",
    tone: "ok" as Tone,
  },
  {
    name: "利用規約の改定について",
    channel: "メール",
    target: "全ユーザー",
    when: "3/15 10:00",
    rate: "28,102 / 39.0%",
    status: "配信済",
    tone: "ok" as Tone,
  },
  {
    name: "休眠30日：あなたの未来の自分が待っています",
    channel: "プッシュ",
    target: "休眠 30日+",
    when: "停止中",
    rate: "— / —",
    status: "下書き",
    tone: "muted" as Tone,
  },
];

/* ---- A8 監査ログ・権限 ---------------------------------------------- */

export const MEMBERS = [
  {
    name: "田中 誠",
    email: "tanaka@selfsketch.jp",
    role: "Owner",
    mfa: "有効",
    lastLogin: "3分前",
    status: "有効",
    tone: "ok" as Tone,
  },
  {
    name: "佐藤 あや",
    email: "sato@selfsketch.jp",
    role: "Admin",
    mfa: "有効",
    lastLogin: "1時間前",
    status: "有効",
    tone: "ok" as Tone,
  },
  {
    name: "鈴木 健",
    email: "suzuki@selfsketch.jp",
    role: "Moderator",
    mfa: "有効",
    lastLogin: "今日 09:12",
    status: "有効",
    tone: "ok" as Tone,
  },
  {
    name: "高橋 由紀",
    email: "takahashi@selfsketch.jp",
    role: "Moderator",
    mfa: "有効",
    lastLogin: "昨日 18:40",
    status: "有効",
    tone: "ok" as Tone,
  },
  {
    name: "伊藤 直",
    email: "ito@selfsketch.jp",
    role: "Analyst",
    mfa: "未設定",
    lastLogin: "3日前",
    status: "要対応",
    tone: "warn" as Tone,
  },
  {
    name: "外部委託 渡辺",
    email: "cs-partner@example.com",
    role: "Support",
    mfa: "有効",
    lastLogin: "12日前",
    status: "期限切れ間近",
    tone: "warn" as Tone,
  },
];

export const ROLE_MATRIX = [
  { role: "Owner", description: "すべて + 請求 + メンバー管理" },
  { role: "Admin", description: "ユーザー操作・配信・審査（請求は閲覧のみ）" },
  { role: "Support", description: "ユーザー閲覧・サポート対応・審査" },
  { role: "Analyst", description: "集計値の閲覧のみ（個別ユーザー不可）" },
];

export const AUDIT_FILTERS = [
  "すべて",
  "ユーザー操作",
  "開示・閲覧",
  "配信",
  "権限変更",
];

export const AUDIT_LOGS = [
  {
    time: "04/22 12:41",
    actor: "sato@",
    action: "ユーザーを一時停止",
    target: "user_10412",
    ip: "203.0.113.44",
    result: "成功",
    tone: "ok" as Tone,
  },
  {
    time: "04/22 12:08",
    actor: "suzuki@",
    action: "作品の画像を開示表示（通報対応）",
    target: "art_88213",
    ip: "203.0.113.51",
    result: "成功",
    tone: "warn" as Tone,
  },
  {
    time: "04/22 11:52",
    actor: "sato@",
    action: "通報を却下",
    target: "rep_2201",
    ip: "203.0.113.44",
    result: "成功",
    tone: "ok" as Tone,
  },
  {
    time: "04/22 11:30",
    actor: "system",
    action: "月次レポートを一括配信",
    target: "segment_all",
    ip: "—",
    result: "成功",
    tone: "ok" as Tone,
  },
  {
    time: "04/22 10:14",
    actor: "takahashi@",
    action: "ユーザー一覧をCSV書き出し",
    target: "28,610件",
    ip: "203.0.113.77",
    result: "拒否",
    tone: "danger" as Tone,
  },
  {
    time: "04/22 09:48",
    actor: "tanaka@",
    action: "メンバーのロールを変更（Support→Admin）",
    target: "suzuki@",
    ip: "203.0.113.10",
    result: "成功",
    tone: "ok" as Tone,
  },
  {
    time: "04/22 09:02",
    actor: "cs-partner@",
    action: "ユーザー詳細を閲覧",
    target: "user_20114",
    ip: "198.51.100.9",
    result: "成功",
    tone: "ok" as Tone,
  },
  {
    time: "04/22 08:30",
    actor: "system",
    action: "Stripe と同期",
    target: "subscriptions",
    ip: "—",
    result: "成功",
    tone: "ok" as Tone,
  },
];

/* ---- A5 (Adm 9) サービス設定 ---------------------------------------- */

export const SERVICE_SETTINGS = [
  { label: "サービス表示名", value: "SelfSketch" },
  { label: "既定タイムゾーン", value: "(GMT+9) Asia/Tokyo" },
  { label: "既定言語", value: "日本語" },
  { label: "問い合わせの返信元", value: "support@selfsketch.jp" },
];

export const OPERATION_THRESHOLDS = [
  { label: "審査キューの目標応答", value: "4時間以内" },
  { label: "自動非表示にする通報数", value: "3件" },
  { label: "AI 失敗率のアラート", value: "5% を10分継続" },
];

export const FEATURE_FLAGS = [
  {
    key: "century",
    label: "100年ライフ",
    note: null as string | null,
    on: true,
  },
  {
    key: "backcast",
    label: "逆算プラン",
    note: null as string | null,
    on: true,
  },
  {
    key: "friends",
    label: "フレンド機能",
    note: null as string | null,
    on: true,
  },
  {
    key: "bulkExport",
    label: "Web版からの一括書き出し",
    note: "Premium のみ。負荷が高いので夜間だけ有効にしています",
    on: false,
  },
];

export const INTEGRATIONS = [
  {
    name: "Stripe",
    meta: "課金・サブスクリプション",
    status: "接続中",
    tone: "ok" as Tone,
  },
  {
    name: "SendGrid",
    meta: "通知メールの送信",
    status: "接続中",
    tone: "ok" as Tone,
  },
  {
    name: "Slack",
    meta: "#selfsketch-alerts へ通知",
    status: "要設定",
    tone: "warn" as Tone,
  },
];

export const RETENTION_SETTINGS = [
  { label: "監査ログ", value: "3年" },
  { label: "削除済みアカウント", value: "30日" },
];

/* ---- A5 (Adm 10) 権限・メンバー ------------------------------------- */

export const MEMBER_INVITES = [
  { email: "nakamura@selfsketch.jp", role: "Moderator", expiresIn: "あと 5日" },
  { email: "kobayashi@partner.co.jp", role: "Analyst", expiresIn: "あと 2日" },
];

/** ROLE_MATRIX の各ロールで許可されている操作数（分母は全 14 操作） */
export const ROLE_PERMISSIONS = [
  {
    role: "Owner",
    description: "請求・メンバー管理を含むすべての操作。譲渡は Owner のみ。",
    allowed: "全権限",
  },
  {
    role: "Admin",
    description: "設定変更と全画面の閲覧。Owner の変更と請求はできない。",
    allowed: "12 / 14",
  },
  {
    role: "Moderator",
    description: "通報対応と非表示・凍結。売上と個人情報は見られない。",
    allowed: "6 / 14",
  },
  {
    role: "Analyst",
    description: "集計とダッシュボードの閲覧のみ。書き込み操作は不可。",
    allowed: "3 / 14",
  },
  {
    role: "Support",
    description: "問い合わせ対応。ユーザー検索と履歴の閲覧まで。",
    allowed: "4 / 14",
  },
];

export const ACCESS_POLICIES = [
  {
    key: "sso",
    label: "SSO を必須にする",
    note: "Google Workspace 経由のみ許可",
    on: true,
  },
  {
    key: "ipAllowlist",
    label: "IP アドレス制限",
    note: "社内 2件 / VPN 1件 を許可中",
    on: true,
  },
];
