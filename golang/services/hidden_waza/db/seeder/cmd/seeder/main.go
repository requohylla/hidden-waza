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
	userCount       = 1000
	resumeCount     = 1000
	languageCount   = 1000
	toolCount       = 1000
	osCount         = 1000
	skillCount      = 1000
	experienceCount = 1000
	bulkSize        = 500 // 1回のINSERT件数上限
)

func bulkInsert[T any](db *gorm.DB, data []T, table string, wantCount int) error {
	var cnt int64
	if err := db.Table(table).Count(&cnt).Error; err != nil {
		return err
	}
	if int(cnt) >= wantCount {
		fmt.Println(table, "は既に", cnt, "件存在するためスキップします。")
		return nil
	}
	for i := 0; i < len(data); i += bulkSize {
		end := i + bulkSize
		if end > len(data) {
			end = len(data)
		}
		if err := db.Table(table).Create(data[i:end]).Error; err != nil {
			return err
		}
	}
	return nil
}

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
	if err := bulkInsert(db, users, "users", userCount); err != nil {
		log.Printf("users投入失敗: %v", err)
	}
	fmt.Println("usersテーブルに", userCount, "件のダミーデータを投入しました。")

	// resumes投入
	resumes := dummydata.GenerateResumes(resumeCount)
	if err := bulkInsert(db, resumes, "resumes", resumeCount); err != nil {
		log.Printf("resumes投入失敗: %v", err)
	}
	fmt.Println("resumesテーブルに", resumeCount, "件のダミーデータを投入しました。")

	// languages投入
	languages := dummydata.GenerateLanguages(languageCount)
	if err := bulkInsert(db, languages, "languages", languageCount); err != nil {
		log.Printf("languages投入失敗: %v", err)
	}
	fmt.Println("languagesテーブルに", languageCount, "件のダミーデータを投入しました。")

	// tools投入
	tools := dummydata.GenerateTools(toolCount)
	if err := bulkInsert(db, tools, "tools", toolCount); err != nil {
		log.Printf("tools投入失敗: %v", err)
	}
	fmt.Println("toolsテーブルに", toolCount, "件のダミーデータを投入しました。")

	// os投入
	oses := dummydata.GenerateOSes(osCount)
	if err := bulkInsert(db, oses, "os", osCount); err != nil {
		log.Printf("os投入失敗: %v", err)
	}
	fmt.Println("osテーブルに", osCount, "件のダミーデータを投入しました。")

	// skills投入
	skills := dummydata.GenerateSkills(skillCount, resumeCount, languageCount, toolCount, osCount)
	if err := bulkInsert(db, skills, "skills", skillCount); err != nil {
		log.Printf("skills投入失敗: %v", err)
	}
	fmt.Println("skillsテーブルに", skillCount, "件のダミーデータを投入しました。")

	// experiences投入
	experiences := dummydata.GenerateExperiences(experienceCount, resumeCount)
	if err := bulkInsert(db, experiences, "experiences", experienceCount); err != nil {
		log.Printf("experiences投入失敗: %v", err)
	}
	fmt.Println("experiencesテーブルに", experienceCount, "件のダミーデータを投入しました。")
}
