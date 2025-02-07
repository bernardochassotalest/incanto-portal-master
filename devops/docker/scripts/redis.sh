#!/bin/sh
docker container rm /redis -f
docker run -d --hostname redis --name redis325 -p 6379:6379 redis:3.2.5-alpine
