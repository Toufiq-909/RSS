package routes

import (
	"github.com/gin-gonic/gin"

	"server/handlers"
	"server/middleware"
)
func Router() *gin.Engine{
	router:=gin.Default()
	router.POST("/Signup", handlers.Signup)
	router.GET("/user",handlers.Search)
	router.POST("/login",handlers.Login)
	router.Use(middleware.Authorize())
	router.POST("/logout",handlers.Logout)
	router.DELETE("/delete",handlers.DeleteUser)
	
	return router
}
