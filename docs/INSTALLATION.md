# Guia de Instalação

## Pré-requisitos

### Software Necessário
- Node.js 14+
- PostgreSQL 12+
- MongoDB 4+
- Git
- Docker (opcional)

### Configuração do Ambiente

1. **Clone do Repositório**
```bash
git clone https://github.com/your-org/incanto-portal.git
cd incanto-portal
```

2. **Configuração das Variáveis de Ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Instalação de Dependências**

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd web
npm install
```

ETL:
```bash
cd etl
npm install
```

## Configuração do Banco de Dados

### PostgreSQL

1. **Criar Banco de Dados**
```sql
CREATE DATABASE incanto;
```

2. **Executar Migrações**
```bash
cd server
npm run migrate
```

3. **Carregar Dados Iniciais**
```bash
npm run seed
```

### MongoDB

1. **Criar Banco de Dados**
```bash
use incanto
```

2. **Criar Índices**
```bash
cd server
npm run create-indexes
```

## Inicialização dos Serviços

### Modo Desenvolvimento

1. **Backend**
```bash
cd server
npm run dev
```

2. **Frontend**
```bash
cd web
npm start
```

3. **ETL**
```bash
cd etl
npm run dev
```

### Modo Produção

1. **Backend**
```bash
cd server
npm run build
npm start
```

2. **Frontend**
```bash
cd web
npm run build
```

3. **ETL**
```bash
cd etl
npm run build
npm start
```

## Configuração do Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Verificação da Instalação

1. **Verificar Serviços**
```bash
pm2 status
```

2. **Verificar Logs**
```bash
pm2 logs
```

3. **Testar API**
```bash
curl http://localhost:4000/api/health
```

## Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco de Dados**
- Verificar credenciais no .env
- Verificar se o serviço está rodando
- Verificar firewall

2. **Erro de Permissão**
- Verificar permissões de arquivos
- Verificar usuário do processo

3. **Erro de Porta em Uso**
- Verificar processos rodando
- Alterar porta no .env

## Backup e Restauração

### Backup

1. **PostgreSQL**
```bash
pg_dump -U user incanto > backup.sql
```

2. **MongoDB**
```bash
mongodump --db incanto
```

### Restauração

1. **PostgreSQL**
```bash
psql -U user incanto < backup.sql
```

2. **MongoDB**
```bash
mongorestore --db incanto dump/incanto
```

## Segurança

1. **Firewall**
- Configurar regras para portas necessárias
- Bloquear acessos desnecessários

2. **SSL/TLS**
- Instalar certificados
- Configurar HTTPS

3. **Permissões**
- Configurar usuários e grupos
- Definir permissões de arquivos
