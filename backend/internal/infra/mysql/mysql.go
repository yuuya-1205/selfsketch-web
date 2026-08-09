// Package mysql は *sql.DB の生成と接続設定を担う。
// SQL は書かない（リポジトリの実装は adapter/gateway/mysql）。
package mysql

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	driver "github.com/go-sql-driver/mysql"
)

// 接続プールの設定。MySQL の既定 max_connections（151）に対して余裕を持たせる。
const (
	maxOpenConns    = 25
	maxIdleConns    = 25
	connMaxLifetime = 5 * time.Minute
)

// Open は DSN を検証してから *sql.DB を作り、疎通を確認して返す。
// 呼び出し側は使い終わったら Close すること。
func Open(ctx context.Context, dsn string) (*sql.DB, error) {
	if err := ValidateDSN(dsn); err != nil {
		return nil, err
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("MySQL の接続準備に失敗: %w", err)
	}

	db.SetMaxOpenConns(maxOpenConns)
	db.SetMaxIdleConns(maxIdleConns)
	db.SetConnMaxLifetime(connMaxLifetime)

	// sql.Open は実際には接続しないので、ここで疎通を確認する。
	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("MySQL への接続に失敗: %w", err)
	}

	return db, nil
}

// ValidateDSN は DSN に必須のパラメータが入っているかを確認する。
//
// parseTime と loc を落としても実行時にエラーにならず、DATETIME が
// ローカルタイムとして解釈されて日付が静かにずれる。起動時に弾くほうが安い。
func ValidateDSN(dsn string) error {
	cfg, err := driver.ParseDSN(dsn)
	if err != nil {
		return fmt.Errorf("MYSQL_DSN の解析に失敗: %w", err)
	}

	if !cfg.ParseTime {
		return errors.New("MYSQL_DSN に parseTime=true が要る（無いと DATETIME が []byte で返る）")
	}
	if cfg.Loc == nil || cfg.Loc.String() != time.UTC.String() {
		return fmt.Errorf("MYSQL_DSN に loc=UTC が要る（いまは loc=%v）", cfg.Loc)
	}

	return nil
}
