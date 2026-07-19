package handlers

import (
	"os"
	"server/database"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"aidanwoods.dev/go-paseto"
)
func Login(c *gin.Context) {
  var user models.LoginRequest
  if err:=c.ShouldBindJSON(&user);  err!=nil {
	c.JSON(400,gin.H{"error":err})
	return
  }
  var LegitUser models.User
  result:=database.DB.Where("Name =?",user.Name).Find(&LegitUser)
  if result.Error!=nil {
	c.JSON(500,gin.H{"error":result.Error})
	return

  } else if result.RowsAffected<0 {
	c.JSON(404,gin.H{"error":"Invalid Username or password"})
	return
  } else {

	err:=bcrypt.CompareHashAndPassword([]byte(LegitUser.Password),[]byte(user.Password))

	if err!=nil {
		c.JSON(409,gin.H{"error":"Invalid username or password"})
	return
	} else{
		token:=paseto.NewToken()
		token.SetIssuedAt(time.Now())
		token.SetNotBefore(time.Now())
		token.SetExpiration(time.Now().Add(4*time.Minute))
		token.SetString("userId",user.Name)
		secret:=os.Getenv("secret")
		key,_:=paseto.V4SymmetricKeyFromHex(secret)
		encrypted:=token.V4Encrypt(key,nil)
		c.JSON(200,encrypted)

		return

	}

  }
}