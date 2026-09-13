package handlers

import (
	
	"server/database"
	"server/models"
	"net/http"

	"github.com/gin-gonic/gin"
)
func Addfeed(c *gin.Context){
   var userfeed models.Newfeed

   if err:=c.ShouldBindJSON(&userfeed); err!=nil{
	c.JSON(400,gin.H{"error":"Invaild request"})
	return
   }

   userId,_:=c.Get("userId")
   if userId!=userfeed.Name {

	c.JSON(401,gin.H{"msg":"You don't have authority to create the request"})
	return

   } else {
	resp,err:=http.Get(userfeed.Url);
   
   if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
   defer resp.Body.Close()
    var result models.UserFeed
   search:=database.DB.Where("name = ? AND 	feed = ?",userfeed.Name,userfeed.Feed).Find(&result)
   if search.RowsAffected==0 {
	result:=database.DB.Model(&models.UserFeed{}).
  Create(&models.UserFeed{Name:userfeed.Name,Feed:userfeed.Feed})

  if result.Error!=nil{
	c.JSON(500,gin.H{"error":"Server Issue"});
  }

  var feed models.Feed
  search:=database.DB.Where("feed =?",userfeed.Feed).First(&feed)

  if search.RowsAffected==0 {
	
	result:=database.DB.Model(&models.Feed{}).Create(&models.Feed{Feed:userfeed.Feed,Url:userfeed.Url})
	if result.Error!=nil{
		c.JSON(500,gin.H{"error":"Server Issue"});
		return
	}

	c.JSON(200,gin.H{"success":"Created feed"});
	return
  } else{
	c.JSON(200,gin.H{"msg":"Feed already exists in Feed and url table"})
	return
  }
   } else {
	c.JSON(409,gin.H{"msg":"user and feed already exists"})
	return
   }
   }

   

	

	
	
 
  

}