## Criar ambiente de desenvolvimento com DOCKER

docker run -d -p 5432:5432 -v ~/postgresql_data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=Skill777 --name postgres postgres

docker start postgres

Copiar o backup para maquina e fazer o restore com o comando abaixo
psql postgresql://postgres:Skill777@localhost:5432/tst-incanto < db-postgres