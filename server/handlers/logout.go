package handlers

import (
	"context"
	"log"
	"server/database"
	"time"
	"server/models"

	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	
	detachedCtx := context.Background() 

    ctx, cancel := context.WithTimeout(detachedCtx, 2 * time.Second)
    defer cancel()
	var token models.Token
	if err:=c.ShouldBindJSON(&token);err!=nil || token.Val==""{
		c.JSON(400,gin.H{"error":err})
		return

	}
	log.Println(token.Val)
	_,err:=database.Client.RPush(ctx,"blacklist",token.Val).Result()
	if err!=nil {
		c.JSON(500,gin.H{"error":err})
		return
	} else {
		log.Println(database.Client.LRange(ctx,"blacklist",0,-1))
		c.JSON(200,gin.H{"success":"Logout successfully"})
		return
	}

	
  

}