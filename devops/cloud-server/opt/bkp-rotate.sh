#!/bin/bash

echo "`date "+%Y-%m-%d %T"` [Rotina de backup rotate iniciada] "

find /opt/backups/ -type f -name "*.tgz" | sort -r | tail -n +8 | while read x; do
    echo "Removing... $x"
    rm "$x"
done

echo "`date "+%Y-%m-%d %T"` [Rotina de backup rotate concluída] "