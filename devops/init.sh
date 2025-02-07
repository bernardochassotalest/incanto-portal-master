#!/bin/sh
cd docker/scripts
sh mailcatcher.sh
sh postgres.sh
sh rabbitmq.sh
sh redis.sh
sh mongodb.sh