package main

import (
	"context"
	"database/sql"
	"log"
	"time"

	"github.com/yuuya-1205/selfsketch-web/backend/internal/adapter/handler"
	"github.com/yuuya-1205/selfsketch-web/backend/internal/infra/config"
	"github.com/yuuya-1205/selfsketch-web/backend/internal/infra/mysql"
)

// connectTimeout は起動時の疎通確認に使う制限時間。
const connectTimeout = 5 * time.Second

func main() {
	cfg := config.Load()

	// 依存の配線はここだけで行う（backend-conventions）。
	// リポジトリとハンドラを足すときは、この db を渡して NewRouter に配線する。
	db := openDB(cfg.MySQLDSN)
	if db != nil {
		defer db.Close()
	}

	r := handler.NewRouter()
	log.Printf("selfsketch backend listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}

// openDB は DSN があれば MySQL に接続する。
//
// 未設定なら nil を返して DB なしで起動する。いまは DB を使うエンドポイントが無く、
// /healthz を叩くだけのために MySQL を立てさせたくないため。
// 最初のリソースを実装する時点で必須にする。
func openDB(dsn string) *sql.DB {
	if dsn == "" {
		log.Print("MYSQL_DSN が未設定のため DB なしで起動する")
		return nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), connectTimeout)
	defer cancel()

	db, err := mysql.Open(ctx, dsn)
	if err != nil {
		log.Fatal(err)
	}
	log.Print("MySQL に接続した")

	return db
}
