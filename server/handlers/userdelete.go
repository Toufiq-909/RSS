package handlers
import (
	"github.com/gin-gonic/gin"
	"server/database"
	"server/models"
	"log"
)
func DeleteUser(c *gin.Context) {

	name,exists:=c.Get("userId")
	if !exists {
		c.JSON(500,gin.H{"error":"Invalid token"})
		return
	} else {
		
result := database.DB.Where("name = ?", name).Delete(&models.User{})


if result.Error != nil {
    log.Println("Database error:", result.Error)
    c.JSON(500, gin.H{"error": "Failed to delete user"})
    return
}

if result.RowsAffected == 0 {
    c.JSON(404, gin.H{"error": "No user found with that name"})
    return
}

c.JSON(200, gin.H{"message": "User deleted successfully!"})

	}


}