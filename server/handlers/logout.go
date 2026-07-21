package handlers

import (
	"context"
	
	"server/database"
	
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func Logout(c *gin.Context) {
	
	detachedCtx := context.Background() 

    ctx, cancel := context.WithTimeout(detachedCtx, 2 * time.Second)
    defer cancel()
	token,_:=c.Get("token")
	if token==""{
		c.JSON(400,gin.H{"error":"bad request"})
		return

	}
	
	database.Client.XAdd(ctx,&redis.XAddArgs{
		Stream:"blacklistTokens",
		Values: map[string]interface{}{"token": token},
		ID:"*",
	})
	_,err:=database.Client.RPush(ctx,"blacklist",token).Result()
	if err!=nil {
		c.JSON(500,gin.H{"error":err})
		return
	} else {
	
		c.JSON(200,gin.H{"success":"Logout successfully"})
		return
	}

	
  

}