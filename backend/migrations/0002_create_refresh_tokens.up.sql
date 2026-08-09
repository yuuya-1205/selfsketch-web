-- 認証は JWT（アクセストークンはステートレス）。DB に持つのはリフレッシュトークンだけ。
-- token_hash は SHA-256 の hex 64 桁で、平文のトークンは保存しない。
-- rotated_from はローテーション元の行 ID。使用済みトークンが再提示されたら
-- 盗用とみなして系列ごと失効させるための追跡に使う。
CREATE TABLE refresh_tokens (
  id           CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  user_id      CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  token_hash   CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  rotated_from CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NULL,
  -- 「ログイン中の端末」の表示用。IP アドレスは保存しない
  user_agent   VARCHAR(255) NULL,
  expires_at   DATETIME(3) NOT NULL,
  revoked_at   DATETIME(3) NULL,
  created_at   DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_tokens_token_hash (token_hash),
  KEY idx_refresh_tokens_user_expires (user_id, expires_at),
  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
