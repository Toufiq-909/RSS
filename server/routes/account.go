package routes
import (
	"github.com/gin-gonic/gin"


	"server/handlers"
)
func Router() *gin.Engine{
	router:=gin.Default()
	router.POST("/Signup", handlers.Signup)
	router.GET("/user",handlers.Search)

	return router
}
