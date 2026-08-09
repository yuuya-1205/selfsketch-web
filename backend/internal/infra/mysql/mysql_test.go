package mysql

import (
	"strings"
	"testing"
)

// ValidateDSN は接続しないので、CI でも DB なしに走る。
// 実際に繋ぐ確認は verify-api の手順で行う。
func TestValidateDSN(t *testing.T) {
	tests := []struct {
		name    string
		dsn     string
		wantErr string // 空ならエラーなしを期待する
	}{
		{
			name:    "必須パラメータが揃っている",
			dsn:     "u:p@tcp(127.0.0.1:3306)/selfsketch?parseTime=true&loc=UTC&charset=utf8mb4",
			wantErr: "",
		},
		{
			name:    "parseTime がない",
			dsn:     "u:p@tcp(127.0.0.1:3306)/selfsketch?loc=UTC",
			wantErr: "parseTime=true",
		},
		{
			name:    "loc が UTC ではない",
			dsn:     "u:p@tcp(127.0.0.1:3306)/selfsketch?parseTime=true&loc=Asia%2FTokyo",
			wantErr: "loc=UTC",
		},
		{
			name:    "loc の指定がない（既定は UTC なので通る）",
			dsn:     "u:p@tcp(127.0.0.1:3306)/selfsketch?parseTime=true",
			wantErr: "",
		},
		{
			name:    "DSN として壊れている",
			dsn:     "これは DSN ではない",
			wantErr: "解析に失敗",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateDSN(tt.dsn)

			if tt.wantErr == "" {
				if err != nil {
					t.Fatalf("エラー: got %v, want nil", err)
				}
				return
			}

			if err == nil {
				t.Fatalf("エラー: got nil, want %q を含むエラー", tt.wantErr)
			}
			if !strings.Contains(err.Error(), tt.wantErr) {
				t.Errorf("エラーメッセージ: got %q, want %q を含む", err.Error(), tt.wantErr)
			}
		})
	}
}
