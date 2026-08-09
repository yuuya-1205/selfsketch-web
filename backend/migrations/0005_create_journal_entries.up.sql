-- ジャーナル。body は段落配列ではなくプレーンテキスト 1 本で持ち、
-- 空行区切りの段落分割はフロントで行う。
-- 表示用の値（moodColor / excerpt / dateLabel）は持たない。mood の enum からフロントが引く。
CREATE TABLE journal_entries (
  id          CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id     CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  -- 紐づく習慣。習慣を物理削除してもジャーナルは残す
  habit_id    CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NULL,
  title       VARCHAR(128) NOT NULL,
  body        MEDIUMTEXT NOT NULL,
  mood        ENUM('calm', 'bright', 'positive', 'sleepy', 'stagnant') NULL,
  mood_score  DECIMAL(2, 1) NULL,
  quote       VARCHAR(255) NULL,
  is_favorite TINYINT(1) NOT NULL DEFAULT 0,
  -- ユーザーTZ の暦日と、UTC の実時刻
  entry_on    DATE NOT NULL,
  written_at  DATETIME(3) NOT NULL,
  created_at  DATETIME(3) NOT NULL,
  updated_at  DATETIME(3) NOT NULL,
  deleted_at  DATETIME(3) NULL,
  PRIMARY KEY (id),
  KEY idx_journal_entries_user_date (user_id, deleted_at, entry_on),
  KEY idx_journal_entries_habit (habit_id),
  CONSTRAINT fk_journal_entries_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_journal_entries_habit FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
