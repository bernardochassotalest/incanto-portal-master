#!/bin/sh
docker container rm /mongodb -f
docker run -d --hostname mongodb --name mongodb4 -p 27017:27017 mongo
