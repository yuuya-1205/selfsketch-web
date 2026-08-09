-- ジャーナルとタグの中間テーブル。行を個別に指す必要がないので ULID の id は持たせず、
-- 複合主キーにしている。tag_id 側の索引はタグでの絞り込み用。
CREATE TABLE journal_entry_tags (
  journal_entry_id CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  tag_id           CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  created_at       DATETIME(3) NOT NULL,
  PRIMARY KEY (journal_entry_id, tag_id),
  KEY idx_journal_entry_tags_tag (tag_id),
  CONSTRAINT fk_journal_entry_tags_entry FOREIGN KEY (journal_entry_id) REFERENCES journal_entries (id) ON DELETE CASCADE,
  CONSTRAINT fk_journal_entry_tags_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
