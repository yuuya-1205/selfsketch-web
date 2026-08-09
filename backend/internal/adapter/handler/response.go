package handler

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/yuuya-1205/selfsketch-web/backend/internal/domain"
)

// エラーレスポンスの既定 code。リソース固有の code を返したいときは
// respondErrorWith を直接呼ぶ（例: "habit_not_found"）。
const (
	codeNotFound       = "not_found"
	codeInvalidRequest = "invalid_request"
	codeConflict       = "conflict"
	codeInternalError  = "internal_error"
)

// internalErrorMessage は 500 のときに返す固定文言。
// 内部エラーの中身はレスポンスに載せず、ログにだけ出す。
const internalErrorMessage = "サーバー内部でエラーが発生した"

// errorBody は API が返すエラーの中身。
// code は機械可読な固定文字列、message は開発者向け。
// ユーザーに見せる文言はフロントが code から引く。
type errorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// respondError はドメインエラーを HTTP ステータスに変換して返す。
// 想定外のエラーは中身を伏せて 500 にし、詳細はログへ出す。
func respondError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, domain.ErrNotFound):
		respondErrorWith(c, http.StatusNotFound, codeNotFound, err.Error())
	case errors.Is(err, domain.ErrInvalid):
		respondErrorWith(c, http.StatusBadRequest, codeInvalidRequest, err.Error())
	case errors.Is(err, domain.ErrConflict):
		respondErrorWith(c, http.StatusConflict, codeConflict, err.Error())
	default:
		log.Printf("想定外のエラー: %v (%s %s)", err, c.Request.Method, c.Request.URL.Path)
		respondErrorWith(c, http.StatusInternalServerError, codeInternalError, internalErrorMessage)
	}
}

// respondErrorWith はステータスと code を明示してエラーを返す。
// 以降のハンドラを止めたいので c.JSON ではなく AbortWithStatusJSON を使う。
func respondErrorWith(c *gin.Context, status int, code, message string) {
	c.AbortWithStatusJSON(status, gin.H{"error": errorBody{Code: code, Message: message}})
}
