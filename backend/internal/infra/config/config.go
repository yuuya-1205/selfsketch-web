// Package config は環境変数からサーバーの起動設定を読む。
package config

import "os"

// defaultPort は PORT が未設定のときに使うポート。
const defaultPort = "8080"

// Config はサーバーの起動設定。
type Config struct {
	// Port は HTTP サーバーが待ち受けるポート。
	Port string
	// MySQLDSN は MySQL の接続文字列。未設定なら空文字。
	MySQLDSN string
}

// Load は環境変数を読んで Config を返す。
//
// MYSQL_DSN が空でもエラーにしない。いまは DB を使うエンドポイントが無く、
// /healthz の確認に MySQL を立てさせたくないため。最初のリソースを実装する時点で必須にする。
func Load() Config {
	return Config{
		Port:     lookupOr("PORT", defaultPort),
		MySQLDSN: os.Getenv("MYSQL_DSN"),
	}
}

// lookupOr は環境変数を読み、未設定または空文字なら fallback を返す。
func lookupOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}

	return fallback
}
