// Package domain は SelfSketch のドメインモデルを表す。
// このパッケージはサードパーティのライブラリに依存しない（Gin も database/sql も見えない）。
package domain

import "errors"

// ドメイン層が返すセンチネルエラー。
// 判定は errors.Is で行い、HTTP ステータスへの変換は adapter/handler が担う。
// ここでは HTTP を知らない。
var (
	// ErrNotFound は対象のリソースが存在しないことを表す。
	ErrNotFound = errors.New("見つからない")
	// ErrConflict は既存の状態と競合していることを表す。
	ErrConflict = errors.New("競合している")
	// ErrInvalid は入力が不正であることを表す。
	ErrInvalid = errors.New("入力が不正")
)
