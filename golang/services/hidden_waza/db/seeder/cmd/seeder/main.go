// main.go: dummydataを使って各テーブルにダミーデータを投入
package main

import (
	"fmt"
	"log"

	"github.com/requohylla/hidden-waza/pkg/config"
	"github.com/requohylla/hidden-waza/services/hidden_waza/db/seeder/dummydata"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const (
	userCount       = 10000
	resumeCount     = 10000
	languageCount   = 10000
	toolCount       = 10000
	osCount         = 10000
	skillCount      = 10000
	experienceCount = 10000
)

func main() {
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
	users := dummydata.GenerateUsers(userCount)
	if err := db.Create(&users).Error; err != nil {
		log.Printf("users投入失敗: %v", err)
	}
	fmt.Println("usersテーブルに", userCount, "件のダミーデータを投入しました。")

	// resumes投入
	resumes := dummydata.GenerateResumes(resumeCount)
	if err := db.Create(&resumes).Error; err != nil {
		log.Printf("resumes投入失敗: %v", err)
	}
	fmt.Println("resumesテーブルに", resumeCount, "件のダミーデータを投入しました。")

	// languages投入
	languages := dummydata.GenerateLanguages(languageCount)
	if err := db.Create(&languages).Error; err != nil {
		log.Printf("languages投入失敗: %v", err)
	}
	fmt.Println("languagesテーブルに", languageCount, "件のダミーデータを投入しました。")

	// tools投入
	tools := dummydata.GenerateTools(toolCount)
	if err := db.Create(&tools).Error; err != nil {
		log.Printf("tools投入失敗: %v", err)
	}
	fmt.Println("toolsテーブルに", toolCount, "件のダミーデータを投入しました。")

	// os投入
	oses := dummydata.GenerateOSes(osCount)
	if err := db.Create(&oses).Error; err != nil {
		log.Printf("os投入失敗: %v", err)
	}
	fmt.Println("osテーブルに", osCount, "件のダミーデータを投入しました。")

	// skills投入
	skills := dummydata.GenerateSkills(skillCount, resumeCount, languageCount, toolCount, osCount)
	if err := db.Create(&skills).Error; err != nil {
		log.Printf("skills投入失敗: %v", err)
	}
	fmt.Println("skillsテーブルに", skillCount, "件のダミーデータを投入しました。")

	// experiences投入
	experiences := dummydata.GenerateExperiences(experienceCount, resumeCount)
	if err := db.Create(&experiences).Error; err != nil {
		log.Printf("experiences投入失敗: %v", err)
	}
	fmt.Println("experiencesテーブルに", experienceCount, "件のダミーデータを投入しました。")
}
