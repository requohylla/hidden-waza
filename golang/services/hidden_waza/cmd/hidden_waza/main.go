package main

import (
	"fmt"
	"net/http"

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
	cfg, err := config.LoadDBConfig("services/hidden_waza/config/db.yaml")
	if err != nil {
		log.Fatal("DB設定読み込み失敗: ", err)
	}
	dsn := cfg.Database.User + ":" + cfg.Database.Password +
		"@tcp(" + cfg.Database.Host + ":" +
		fmt.Sprintf("%d", cfg.Database.Port) + ")/" +
		cfg.Database.Name + "?parseTime=true&charset=utf8mb4"
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
	// URL末尾にあるスラッシュを省く
	e.Pre(middleware.RemoveTrailingSlash())

	e.GET("/", hello)
	e.POST("/api/v1/resume/post", wrapHTTPHandler(h.CreateResume))
	e.GET("/api/v1/resume/get", wrapHTTPHandler(h.GetResumes))
	e.GET("/api/v1/resume/get/:id", h.GetResumeByID)

	e.GET("/api/v1/resume/get/user/:user_id", h.GetResumesByUserID)
	e.Logger.Fatal(e.Start(":8080"))
}

// http.HandlerFuncをecho.HandlerFuncに変換
func wrapHTTPHandler(f func(http.ResponseWriter, *http.Request)) echo.HandlerFunc {
	return func(c echo.Context) error {
		f(c.Response(), c.Request())
		return nil
	}
}

func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}
