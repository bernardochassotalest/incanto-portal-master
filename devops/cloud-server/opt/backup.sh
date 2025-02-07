#!/bin/bash

set -e

export PATH="$PATH:/usr/local/bin"
DROPBOX_UPLOADER=/opt/dropbox_uploader.sh

echo "`date "+%Y-%m-%d %T"` [Iniciando Rotina de Backup]"

# Obtém o diretório onde o script está sendo executado
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIR=${DIR}/backups/
echo "`date "+%Y-%m-%d %T"`" [Diretório de execução] ${DIR}

# Armazenar a data atual no formato YYYY-mm-DD-HHMMSS
DATE=$(date -u "+%F-%H%M%S")
FILE_NAME="prd-incanto-${DATE}"
mkdir -p ${DIR}${FILE_NAME}
cd ${DIR}${FILE_NAME}

# Postgres
sudo -u postgres /usr/bin/pg_dump -Fp incanto > "db-postgres.sql"

# MongoDB
mongodump --archive --gzip --db incanto > "db-mongo.gz"

# Files
tar -C /opt/attachments/ -cvzf "attachments.tgz" /opt/attachments/incanto-jobs

echo "`date "+%Y-%m-%d %T"` preparando arquivos"

cd ..
tar -cvzf "${FILE_NAME}.tgz" ${FILE_NAME}

$DROPBOX_UPLOADER -h -p -f /home/administrador/.dropbox_uploader upload "${DIR}${FILE_NAME}.tgz" /

echo "`date "+%Y-%m-%d %T"` [Removendo arquivo temporário do backup] ${DIR}"
# Remove o arquivo compactado de backup
rm -rf ${DIR}${FILE_NAME}

echo "`date "+%Y-%m-%d %T"` [Rotina de backup concluída] "