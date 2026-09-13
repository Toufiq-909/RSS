package models

import "gorm.io/gorm"
type UserFeed struct {
	gorm.Model
	Name string
	Feed string
}
