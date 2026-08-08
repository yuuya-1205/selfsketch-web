package main

import (
	"log"
	"os"

	"github.com/yuuya-1205/selfsketch-web/backend/internal/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := api.NewRouter()
	log.Printf("selfsketch backend listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
