package middleware

import (
	"log"

	"github.com/gin-gonic/gin"

	"os"

	"aidanwoods.dev/go-paseto"

	"server/models"
)

func Authorize() gin.HandlerFunc {
        return func(c*gin.Context) {

			var token models.Token
			if err:=c.ShouldBindJSON(&token); err!=nil {
				c.AbortWithStatusJSON(400, gin.H{"error": err})
				return
			} else {
				parser:=paseto.NewParser()
				key,_:=paseto.V4SymmetricKeyFromHex(os.Getenv("secret"))
				token,err:=parser.ParseV4Local(key,token.Val,nil)
				
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