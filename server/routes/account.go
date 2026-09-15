package routes

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"server/handlers"
	"server/middleware"
)

func Router() *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.POST("/Signup", handlers.Signup)
	router.GET("/user", handlers.Search)
	router.POST("/login", handlers.Login)
	router.Use(middleware.Authorize())
	router.POST("/logout", handlers.Logout)
	router.DELETE("/delete", handlers.DeleteUser)
	router.POST("/feed", handlers.Addfeed)
	router.GET("/getFeed", handlers.GetFeed)

	return router
}
