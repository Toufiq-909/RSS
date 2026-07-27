package middleware

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	"os"

	"server/database"

	"aidanwoods.dev/go-paseto"

)

func Authorize() gin.HandlerFunc {
        return func(c*gin.Context) {

			token:=c.GetHeader("Authorization")
			if token=="" {
				c.AbortWithStatusJSON(400, gin.H{"error": "Invalid Authorization Token"})
				return
			} else {
				ctx:=context.Background()
				c.Set("token",token)

				index,err:=database.Client.LPos(ctx,"blacklist",token,redis.LPosArgs{}).Result()

				if index>=0&&err==nil {
					c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
				return

				} else {


					parser:=paseto.NewParser()
				key,_:=paseto.V4SymmetricKeyFromHex(os.Getenv("secret"))
				token,err:=parser.ParseV4Local(key,token,nil)
				
if err != nil {
	c.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})
	return
   
} else {
var r string
token.Get("userId",&r)
				log.Println(r)
				c.Set("userId",r)
				
				c.Next()

				


			}

				}




				



		}
		}

}