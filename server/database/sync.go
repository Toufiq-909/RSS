package database

import (
	"context"
	"fmt"
	"log"
	"server/models"
	"strings"

	//"aidanwoods.dev/go-result/result"
	"github.com/redis/go-redis/v9"
)

func Sync() {
	ctx:=context.Background()
	err := Client.XGroupCreate(ctx, "blacklistTokens", "server1", "0").Err()
	if err != nil && !strings.Contains(err.Error(), "BUSYGROUP") {
		fmt.Println("failed to create group:", err)
		return
	}
	for {
		entries, err := Client.XReadGroup(ctx,&redis.XReadGroupArgs{
			Group: "server1",
			Consumer:"worker1",
			Streams: []string{"blacklistTokens",">"},//> means it shows only the new data
			Block: 0,
			Count: 10,

		}).Result()

		 if err != nil {
            fmt.Println("read error:", err)
            continue
        }
		for _,token:=range entries[0].Messages {
			log.Println(token.Values["token"],"happy")
			var tokn models.Token
			tokn.Val=token.Values["token"].(string)
			DB.Create(&tokn)
			
			Client.XAck(ctx,"blacklistTokens","server1",token.ID)
		}
	}
}