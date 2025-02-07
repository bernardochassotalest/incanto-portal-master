#!/bin/sh
docker container rm /postgres -f
docker run -d -p 5432:5432 -v ~/docker/postgres/data:/var/lib/postgresql/data \
              -e POSTGRES_PASSWORD=Skill777 --shm-size=256m --name postgres postgres:12
