#!/bin/sh
docker container rm /mailcatcher -f
docker run -d -p 1025:1025 -p 1080:1080 --name mailcatcher dockage/mailcatcher:0.7.1
