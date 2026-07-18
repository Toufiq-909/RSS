package main

import (
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
	router:=routes.Router()
	
	router.Run()
}