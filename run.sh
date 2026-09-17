#!/bin/bash 
cd client
npm run dev &
cd ../ 
cd server
go run main.go