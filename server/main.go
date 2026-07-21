package main

import (
	"fmt"
	"log"
	"server/database"
	"server/routes"

	"github.com/joho/godotenv"
)

func main(){

	if err:=godotenv.Load(); err!=nil{
		log.Fatal("Env failed")
	}
	database.Connect()
	database.Redis()
	go database.Sync()
	router:=routes.Router()
	fmt.Println("running")
	
	router.Run("localhost:8080")
}