package database
import (
    "log"
    "os"

    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dburl:=os.Getenv("pooldb")

	if dburl=="" {
		log.Fatal("db connection is not set")
	}

	db,err:=gorm.Open(postgres.Open(dburl),&gorm.Config{})
	if err!=nil {
		log.Fatal("db connection failed")
	}

	sqlDB, err := db.DB()
    if err != nil {
        log.Fatal("Failed to get sql.DB:", err)
    }

    sqlDB.SetMaxIdleConns(5)
    sqlDB.SetMaxOpenConns(20)

    DB = db
    log.Println("Successfully connected to Neon Postgres!")
}