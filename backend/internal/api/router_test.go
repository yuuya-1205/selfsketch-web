package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	// テスト中は Gin のデバッグログを抑える。
	gin.SetMode(gin.TestMode)
	m.Run()
}

// doRequest は NewRouter() に対して 1 リクエストを流し、レコーダーを返す。
func doRequest(t *testing.T, method, path string) *httptest.ResponseRecorder {
	t.Helper()

	req := httptest.NewRequest(method, path, nil)
	rec := httptest.NewRecorder()
	NewRouter().ServeHTTP(rec, req)

	return rec
}

// decodeJSON はレスポンスボディを map にデコードする。
func decodeJSON(t *testing.T, rec *httptest.ResponseRecorder) map[string]any {
	t.Helper()

	var body map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatalf("レスポンスボディが JSON ではない: %v (body=%q)", err, rec.Body.String())
	}

	return body
}

func TestHealthz(t *testing.T) {
	rec := doRequest(t, http.MethodGet, "/healthz")

	if rec.Code != http.StatusOK {
		t.Fatalf("ステータスコード: got %d, want %d", rec.Code, http.StatusOK)
	}

	body := decodeJSON(t, rec)
	if got, want := body["status"], "ok"; got != want {
		t.Errorf(`body["status"]: got %v, want %q`, got, want)
	}
	if len(body) != 1 {
		t.Errorf("レスポンスのキー数: got %d (%v), want 1", len(body), body)
	}
}

func TestPing(t *testing.T) {
	rec := doRequest(t, http.MethodGet, "/api/v1/ping")

	if rec.Code != http.StatusOK {
		t.Fatalf("ステータスコード: got %d, want %d", rec.Code, http.StatusOK)
	}

	body := decodeJSON(t, rec)
	if got, want := body["message"], "pong"; got != want {
		t.Errorf(`body["message"]: got %v, want %q`, got, want)
	}
	if len(body) != 1 {
		t.Errorf("レスポンスのキー数: got %d (%v), want 1", len(body), body)
	}
}

func TestUnknownRouteReturns404(t *testing.T) {
	for _, path := range []string{"/api/v1/unknown", "/nope"} {
		t.Run(path, func(t *testing.T) {
			rec := doRequest(t, http.MethodGet, path)

			if rec.Code != http.StatusNotFound {
				t.Errorf("ステータスコード: got %d, want %d", rec.Code, http.StatusNotFound)
			}
		})
	}
}

// ping は GET のみ。POST は 404（Gin の既定では未登録メソッドは NotFound 扱い）。
func TestPingRejectsPost(t *testing.T) {
	rec := doRequest(t, http.MethodPost, "/api/v1/ping")

	if rec.Code == http.StatusOK {
		t.Errorf("POST /api/v1/ping が 200 を返した: body=%q", rec.Body.String())
	}
}
