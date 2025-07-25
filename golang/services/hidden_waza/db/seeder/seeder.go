// seeder.go: dummydataを使って各テーブルにダミーデータを投入

package seeder

import (
	"fmt"
	"log"

	"github.com/requohylla/hidden-waza/pkg/config"
	"github.com/requohylla/hidden-waza/services/hidden_waza/db/seeder/dummydata"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// RunSeeder は全テーブルにダミーデータを投入する
func RunSeeder() {
	cfg, err := config.LoadDBConfig("services/hidden_waza/config/db.yaml")
	if err != nil {
		log.Fatalf("DB設定読み込み失敗: %v", err)
	}
	dbConf := cfg.Database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true&loc=Asia%%2FTokyo",
		dbConf.User, dbConf.Password, dbConf.Host, dbConf.Port, dbConf.Name)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("DB接続失敗: %v", err)
	}

	// users投入
	users := dummydata.GenerateUsers(100)
	if err := db.Create(&users).Error; err != nil {
		log.Printf("users投入失敗: %v", err)
	}
	fmt.Println("usersテーブルに100件のダミーデータを投入しました。")

	// resumes投入
	resumes := dummydata.GenerateResumes(100)
	if err := db.Create(&resumes).Error; err != nil {
		log.Printf("resumes投入失敗: %v", err)
	}
	fmt.Println("resumesテーブルに100件のダミーデータを投入しました。")

	// languages投入
	languages := dummydata.GenerateLanguages(100)
	if err := db.Create(&languages).Error; err != nil {
		log.Printf("languages投入失敗: %v", err)
	}
	fmt.Println("languagesテーブルに100件のダミーデータを投入しました。")

	// tools投入
	tools := dummydata.GenerateTools(100)
	if err := db.Create(&tools).Error; err != nil {
		log.Printf("tools投入失敗: %v", err)
	}
	fmt.Println("toolsテーブルに100件のダミーデータを投入しました。")

	// os投入
	oses := dummydata.GenerateOSes(100)
	if err := db.Create(&oses).Error; err != nil {
		log.Printf("os投入失敗: %v", err)
	}
	fmt.Println("osテーブルに100件のダミーデータを投入しました。")

	// skills投入
	skills := dummydata.GenerateSkills(200, 100, 100, 100, 100)
	if err := db.Create(&skills).Error; err != nil {
		log.Printf("skills投入失敗: %v", err)
	}
	fmt.Println("skillsテーブルに200件のダミーデータを投入しました。")

	// experiences投入
	experiences := dummydata.GenerateExperiences(200, 100)
	if err := db.Create(&experiences).Error; err != nil {
		log.Printf("experiences投入失敗: %v", err)
	}
	fmt.Println("experiencesテーブルに200件のダミーデータを投入しました。")
}
