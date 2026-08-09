export interface GalleryItem {
  id: string;
  /** 作品を記録した日 */
  createdAt: Date;
  title: string;
  /** サムネイルの色を決める種。画像アセットが入ったら消す */
  seed: number;
}

export interface GalleryMonth {
  /** その月の 1日。「2026年 4月」は presentation が作る */
  month: Date;
  /** その月の作品数 */
  count: number;
  /** 「達成率 92%」「初めての作品集」など、月ごとの補足。無ければ null */
  note: string | null;
  items: GalleryItem[];
}
