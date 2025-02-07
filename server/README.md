# API Backend


## Referências

- [Sequelize](https://sequelize.org/v5/)
- [DateFNS](https://date-fns.org/v1.30.1/docs/format)


## .env.development

```
# General
PAGE_SIZE=20
HTTP_PORT=7000
BODY_DATA_LIMIT=100mb
DIR_ATTACHMENT=/tmp/incanto-attachments
JOBS_URL=http://localhost:7777
MASTER_PASS=$e51d2e65bc8c171c26892.accc45ebf8ef5668700#
SEQUELIZE_LOG=none #none/console/winston
TZ=America/Sao_Paulo

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=docker
POSTGRES_DATABASE=incanto

# JWT Token
SECRET_TOKEN=APP@incanto
ISSUER_TOKEN="incanto"
AUDIENCE_TOKEN="Portal incanto"
JWT_SECRET=FE535A8A03F392D661955652DC06FAD3
JWT_EXPIRES=12h

```

## Rodar o postgres

```
#!/bin/sh
docker container rm /postgres
docker run -d -p 5432:5432 -v ~/postgresql_data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=SenhaSecretaDoPostgres --name postgres postgres
```
### iniciando container
```
docker start postgres
```
### Acessando container do postgres
```
docker exec -it postgres bash
```
### Acessando postgres
```
psql -U postgres
```
### Criando database
```
CREATE DATABASE "events";
```
### Removendo database
```
DROP DATABASE "events";
```
### Listar "databases"
```
\l
```
### Conectar a um "database"
```
\c <databasename>
```
### Listar "tables"
```
\dt
```

## Rotinas para criação/alteração de tabelas do Postgres com sequelize

```
# criar uma nova rotina
yarn sequelize migration:create --name=create-entity

# executar as últimas rotinas criadas
yarn sequelize db:migrate

# desfazer a última rotina executada
yarn sequelize db:migrate:undo

# desfazer todas rotinas executadas
yarn sequelize db:migrate:undo:all

# desfazer uma rotinas especifica
yarn sequelize db:migrate:undo:all --to XXXXXXXXXXXXXX-create-schema.js
```

## Rotinas para popular tabelas do Postgres com sequelize

```
# criar uma nova rotina
yarn sequelize seed:generate --name populate-entity

# executar a última rotina criada
yarn sequelize db:seed

# executar todas rotinas criadas
yarn sequelize db:seed:all

# desfazer a última rotina executada
yarn sequelize db:seed:undo

# desfazer todas rotinas executadas
yarn sequelize db:seed:undo:all

# executar um seed especifico
yarn sequelize db:seed --seed nome-do-arquivo
```
