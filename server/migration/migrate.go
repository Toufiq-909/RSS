package main

import (
	"log"
	"os"
	"server/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)
func main(){
	if err:=godotenv.Load();err!=nil{
		log.Fatal("Env issue")
	}
	db,err:=gorm.Open(postgres.Open(os.Getenv("db")),&gorm.Config{})
	if err != nil {
        log.Fatal("Failed to connect to the database:", err)
    }

	log.Println("Connected to direct database. Running migrations...")

    // 4. Run AutoMigrate for your structs
 
    err = db.AutoMigrate(&models.User{})
    if err != nil {
        log.Fatal("Migration failed:", err)
    }

    log.Println("Migration completed successfully! Tables are ready.")

}