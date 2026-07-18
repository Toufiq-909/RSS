package handlers

import (
	
	"time"

	"os"

	"github.com/gin-gonic/gin"

	"golang.org/x/crypto/bcrypt"

	"server/database"

	"aidanwoods.dev/go-paseto"

	"server/models"
)

func Signup(c *gin.Context) {
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var me models.User
	search:=database.DB.Where("Name = ?",user.Name).Find(&me)
	 
	if search.RowsAffected>0{
		c.JSON(409,gin.H{"error":"Name already Exists"})
		return
	}
	bytes,_:=bcrypt.GenerateFromPassword([]byte(user.Password),14)
	
	user.Password=string(bytes)

	result:=database.DB.Create(&user)
	if result.Error != nil {
        c.JSON(500, gin.H{"error": result.Error.Error()})
        return
    }
	token:=paseto.NewToken()
     
	token.SetIssuedAt(time.Now())
	token.SetNotBefore(time.Now())
	token.SetExpiration(time.Now().Add(4*time.Minute))
	token.SetString("userId",user.Name)
	secret := os.Getenv("secret")
	key,_:=paseto.V4SymmetricKeyFromHex(secret)
	encrypted:=token.V4Encrypt(key,nil)
	
	
	
    c.JSON(200, encrypted)
	return 
	

}
func Search(c *gin.Context) {

	name:=c.Query("name")
	
	var me models.User
	search:=database.DB.Where("Name = ?",name).Find(&me)

	if search.RowsAffected>0{
		c.JSON(409,gin.H{"error":"Name already Exists"})
		return
	} else {
		c.JSON(200,gin.H{"success":"Valid Name"})
		return
	}

}

