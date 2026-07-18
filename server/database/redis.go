package database

import (
	"os"

	"github.com/redis/go-redis/v9"
)
var Client *redis.Client
func Redis() {
	opt,_:=redis.ParseURL(os.Getenv("redis"))
	Client=redis.NewClient(opt)
      

}