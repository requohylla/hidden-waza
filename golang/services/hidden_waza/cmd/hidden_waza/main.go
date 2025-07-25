package main

import (
	"net/http"

	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/requohylla/hidden-waza/pkg/config"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/handler"
	"github.com/requohylla/hidden-waza/services/hidden_waza/internal/repository"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// DB設定読み込み
	cfg, err := config.LoadDBConfig("config/db.yaml")
	if err != nil {
		log.Fatal("DB設定読み込み失敗: ", err)
	}
	dsn := cfg.Database.User + ":" + cfg.Database.Password +
		"@tcp(" + cfg.Database.Host + ":" +
		fmt.Sprintf("%d", cfg.Database.Port) + ")/" +
		cfg.Database.Name + "?parseTime=true"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("DB接続失敗: ", err)
	}

	// DI
	repo := repository.NewResumeRepository(db)
	h := handler.NewResumeHandler(repo)

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", hello)
	e.POST("/api/v1/resume", h.CreateResume)
	e.GET("/api/v1/resume", h.GetResumes)

	e.Logger.Fatal(e.Start(":8080"))
}

func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}
