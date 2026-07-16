package main

import (
	"log"
	"server/database"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){

	if err:=godotenv.Load(); err!=nil{
		log.Fatal("Env failed")
	}
	database.Connect()
	router:=gin.Default()
	router.GET("/hello",func(c *gin.Context){
		c.JSON(200,gin.H{
			"msg":"hello my nga",
		})

	})
	router.Run()
}