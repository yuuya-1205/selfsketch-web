-- users はアカウントの基点。id は ULID（Crockford Base32 の大文字 26 桁）をアプリ側で生成する。
-- created_at / updated_at に DEFAULT CURRENT_TIMESTAMP を付けないのは、
-- セッションの time_zone に依存して JST が UTC のつもりで入る事故を防ぐため。
-- 詳細は docs/db-design.md §2。
CREATE TABLE users (
  id                CHAR(26) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  email             VARCHAR(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  password_hash     VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  display_name      VARCHAR(64) NOT NULL,
  -- IANA タイムゾーン名。「今日」の判定に使う
  timezone          VARCHAR(64) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'Asia/Tokyo',
  plan              ENUM('free', 'premium') NOT NULL DEFAULT 'free',
  email_verified_at DATETIME(3) NULL,
  created_at        DATETIME(3) NOT NULL,
  updated_at        DATETIME(3) NOT NULL,
  -- 論理削除。退会時は email をアノニマイズしてから立てる（uq_users_email と衝突するため）
  deleted_at        DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
