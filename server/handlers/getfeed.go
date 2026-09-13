package handlers

import (
	"server/database"
	"server/models"

	"github.com/gin-gonic/gin"
)
func GetFeed(c *gin.Context) {
	Name,exits:=c.Get("userId")
	if !exits {
		c.JSON(400,gin.H{"msg":"Invalid request"})
	} else {
		feed:=make([]models.UserFeed,1)
		result:=database.DB.Where("name=?",Name).Find(&feed)
		
		if result.RowsAffected==0{
			c.JSON(200,gin.H{"msg":"No feed created,try to add an rssfeed "})
		return
		} else{
			c.JSON(200,gin.H{
				"feed":feed,
			})
			return
		} 
	}
	
}