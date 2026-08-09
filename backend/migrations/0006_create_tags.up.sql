-- タグはユーザーごとに名前空間を分ける。#継続14日目 のような個人的なタグを
-- 全ユーザーで共有する意味がないため。name に '#' は含めず、表示時に付ける。
CREATE TABLE tags (
  id         CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id    CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name       VARCHAR(64) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tags_user_name (user_id, name),
  CONSTRAINT fk_tags_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
