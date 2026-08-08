package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// NewRouter は API のルーティングを組み立てる。
// エンドポイントは /api/v1 以下に生やし、ヘルスチェックだけ素の /healthz に置く。
func NewRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	v1 := r.Group("/api/v1")
	{
		// TODO: habits / journal / streak などのリソースをここに追加していく
		v1.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})
	}

	return r
}
