-- 完了の記録。completed_on（ユーザーTZ の暦日）と completed_at（UTC の実時刻）を両方持つ。
-- 前者はストリーク計算とユニーク制約、後者は完了時刻の表示と時間帯分析に使う。
--
-- uq_habit_completions_habit_date がこのテーブルの肝。完了の記録は楽観更新から呼ばれ、
-- 通信の再送で二重に飛びうる。アプリ側のチェックでは競合状態を防げないので DB で弾き、
-- 重複エラーは冪等な成功として扱う。
--
-- user_id はここだけ意図的に非正規化している。年間ヒートマップとストリークが
-- 「そのユーザーの全完了記録」を日付範囲で引くため、habits との JOIN を避けたい。
CREATE TABLE habit_completions (
  id           CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  habit_id     CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id      CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  completed_on DATE NOT NULL,
  completed_at DATETIME(3) NOT NULL,
  -- その日の一言（習慣詳細のノート）。ジャーナル本文とは別物
  note         VARCHAR(500) NULL,
  created_at   DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_habit_completions_habit_date (habit_id, completed_on),
  KEY idx_habit_completions_user_date (user_id, completed_on),
  CONSTRAINT fk_habit_completions_habit FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
  CONSTRAINT fk_habit_completions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
