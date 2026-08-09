package handler

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/yuuya-1205/selfsketch-web/backend/internal/domain"
)

// newTestContext はレスポンスを記録するだけの gin.Context を作る。
func newTestContext(t *testing.T) (*gin.Context, *httptest.ResponseRecorder) {
	t.Helper()

	rec := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rec)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/v1/dummy", nil)

	return c, rec
}

// errorFrom はレスポンスボディから error オブジェクトを取り出す。
func errorFrom(t *testing.T, rec *httptest.ResponseRecorder) map[string]any {
	t.Helper()

	body := decodeJSON(t, rec)
	got, ok := body["error"].(map[string]any)
	if !ok {
		t.Fatalf(`body["error"] がオブジェクトではない: %v`, body)
	}

	return got
}

func TestRespondErrorMapsDomainErrors(t *testing.T) {
	// 500 のケースがログを吐くので捨てる。ログの中身は別テストで確認する。
	log.SetOutput(io.Discard)
	t.Cleanup(func() { log.SetOutput(os.Stderr) })

	tests := []struct {
		name        string
		err         error
		wantStatus  int
		wantCode    string
		wantMessage string
	}{
		{
			name:        "見つからない",
			err:         domain.ErrNotFound,
			wantStatus:  http.StatusNotFound,
			wantCode:    codeNotFound,
			wantMessage: "見つからない",
		},
		{
			// 文脈を足して包んでも errors.Is で判定できる
			name:        "包まれた入力エラー",
			err:         fmt.Errorf("title が空: %w", domain.ErrInvalid),
			wantStatus:  http.StatusBadRequest,
			wantCode:    codeInvalidRequest,
			wantMessage: "title が空: 入力が不正",
		},
		{
			name:        "競合",
			err:         domain.ErrConflict,
			wantStatus:  http.StatusConflict,
			wantCode:    codeConflict,
			wantMessage: "競合している",
		},
		{
			name:        "想定外のエラーは中身を伏せる",
			err:         errors.New("dial tcp 127.0.0.1:3306: connection refused"),
			wantStatus:  http.StatusInternalServerError,
			wantCode:    codeInternalError,
			wantMessage: internalErrorMessage,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c, rec := newTestContext(t)

			respondError(c, tt.err)

			if rec.Code != tt.wantStatus {
				t.Fatalf("ステータスコード: got %d, want %d", rec.Code, tt.wantStatus)
			}
			if !c.IsAborted() {
				t.Error("エラー応答なのに後続のハンドラが止まっていない")
			}

			body := errorFrom(t, rec)
			if got, want := body["code"], tt.wantCode; got != want {
				t.Errorf(`error.code: got %v, want %q`, got, want)
			}
			if got, want := body["message"], tt.wantMessage; got != want {
				t.Errorf(`error.message: got %v, want %q`, got, want)
			}
			if len(body) != 2 {
				t.Errorf("error のキー数: got %d (%v), want 2", len(body), body)
			}
		})
	}
}

// 500 のときは内部エラーの中身をレスポンスに載せず、ログにだけ出す。
func TestRespondErrorLogsInternalErrorWithoutLeaking(t *testing.T) {
	var logBuf bytes.Buffer
	log.SetOutput(&logBuf)
	t.Cleanup(func() { log.SetOutput(os.Stderr) })

	const secret = "user=selfsketch password=hunter2"
	c, rec := newTestContext(t)

	respondError(c, errors.New(secret))

	if strings.Contains(rec.Body.String(), secret) {
		t.Errorf("内部エラーの中身がレスポンスに漏れている: %s", rec.Body.String())
	}
	if !strings.Contains(logBuf.String(), secret) {
		t.Errorf("内部エラーの中身がログに出ていない: %s", logBuf.String())
	}
	if !strings.Contains(logBuf.String(), "/api/v1/dummy") {
		t.Errorf("ログにリクエストパスが出ていない: %s", logBuf.String())
	}
}

// リソース固有の code を返したいときは respondErrorWith を直接呼ぶ。
func TestRespondErrorWithUsesGivenCode(t *testing.T) {
	c, rec := newTestContext(t)

	respondErrorWith(c, http.StatusNotFound, "habit_not_found", "habit id=xxx が見つからない")

	if rec.Code != http.StatusNotFound {
		t.Fatalf("ステータスコード: got %d, want %d", rec.Code, http.StatusNotFound)
	}

	body := errorFrom(t, rec)
	if got, want := body["code"], "habit_not_found"; got != want {
		t.Errorf(`error.code: got %v, want %q`, got, want)
	}
}
