#!/bin/sh
docker container rm /rabbitmq -f
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672  \
           -v ~/docker/rabbitmq/data:/var/lib/rabbitmq rabbitmq:3-management
