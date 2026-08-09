-- slot（時間帯）と recurrence_type（頻度）は別の軸なので分けている。
-- recurrence_days は曜日ビットマスク。bit0 = 月曜、bit6 = 日曜（週の起点は ISO 8601 に合わせる）。
--   daily    -> 127（全ビット）
--   weekdays -> 31（月〜金）
--   weekly   -> 曜日は問わず weekly_target 回
--   custom   -> 任意のビット
-- scheduled_at を TIME にしているのは、「毎朝 7:00」がユーザーの生活時間であって
-- 絶対時刻ではないため。UTC に変換すると timezone 変更で予定がずれる。
CREATE TABLE habits (
  id               CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id          CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  title            VARCHAR(128) NOT NULL,
  slot             ENUM('morning', 'after_wake', 'noon', 'afternoon', 'night', 'before_sleep') NOT NULL,
  scheduled_at     TIME NULL,
  duration_minutes SMALLINT UNSIGNED NULL,
  recurrence_type  ENUM('daily', 'weekdays', 'weekly', 'custom') NOT NULL DEFAULT 'daily',
  recurrence_days  TINYINT UNSIGNED NOT NULL DEFAULT 127,
  weekly_target    TINYINT UNSIGNED NULL,
  sort_order       INT NOT NULL DEFAULT 0,
  started_on       DATE NOT NULL,
  -- 一時停止。deleted_at（削除）とは別概念で、一覧には残るが「今日」の対象から外れる
  paused_at        DATETIME(3) NULL,
  created_at       DATETIME(3) NOT NULL,
  updated_at       DATETIME(3) NOT NULL,
  deleted_at       DATETIME(3) NULL,
  PRIMARY KEY (id),
  -- 一覧は常に WHERE user_id = ? AND deleted_at IS NULL ORDER BY sort_order で引く
  KEY idx_habits_user_sort (user_id, deleted_at, sort_order),
  CONSTRAINT fk_habits_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
