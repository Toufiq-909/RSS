package handlers

import (
	"io"
	"net/http"
	"server/database"
	"server/models"

	"github.com/gin-gonic/gin"
)

func GetFeed(c *gin.Context) {
	Name, exits := c.Get("userId")
	if !exits {
		c.JSON(400, gin.H{"msg": "Invalid request"})
		return
	}

	feed := make([]models.Feed, 0)
	result := database.DB.Joins("Join user_feeds on user_feeds.feed=feeds.feed").Where("Name=?", Name).Find(&feed)

	if result.RowsAffected == 0 {
		c.JSON(200, gin.H{"msg": "No feed created,try to add an rssfeed "})
		return
	}

	Feedxml := make([]string, 0, len(feed))

	for _, value := range feed {
		resp, err := http.Get(value.Url)
		if err != nil {
			Feedxml = append(Feedxml, "Sorry we could get your Feed")
			continue
		}
		defer resp.Body.Close()

		body, readErr := io.ReadAll(resp.Body)
		if readErr != nil {
			Feedxml = append(Feedxml, "Sorry we could get your Feed")
			continue
		}

		Feedxml = append(Feedxml, string(body))
	}

	c.JSON(200, gin.H{
		"feed": Feedxml,
	})
}
