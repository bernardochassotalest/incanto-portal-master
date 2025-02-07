# Manual de Operações

## Monitoramento do Sistema

### Verificação de Saúde

1. **API Status**
```bash
curl https://api.incanto.com/health
```

2. **Serviços**
```bash
pm2 status
```

3. **Recursos**
```bash
# CPU e Memória
htop

# Disco
df -h
```

### Logs

1. **Aplicação**
```bash
# Backend
tail -f /var/log/incanto/api.log

# Frontend
tail -f /var/log/nginx/access.log

# ETL
tail -f /var/log/incanto/etl.log
```

2. **Banco de Dados**
```bash
# PostgreSQL
tail -f /var/log/postgresql/postgresql.log

# MongoDB
tail -f /var/log/mongodb/mongod.log
```

## Backup e Recuperação

### Backup Automático

1. **Configuração**
```bash
# Backup diário às 2:00 AM
0 2 * * * /scripts/backup.sh
```

2. **Verificação**
```bash
# Status do último backup
/scripts/check-backup.sh

# Listar backups
ls -l /backup/
```

### Recuperação

1. **Banco de Dados**
```bash
# PostgreSQL
pg_restore -d incanto backup.sql

# MongoDB
mongorestore --db incanto dump/
```

2. **Arquivos**
```bash
# Restaurar uploads
rsync -av /backup/uploads/ /var/www/uploads/
```

## Manutenção

### Limpeza

1. **Logs**
```bash
# Rotação de logs
logrotate /etc/logrotate.d/incanto

# Limpar temporários
/scripts/clean-temp.sh
```

2. **Dados**
```bash
# Arquivos processados
/scripts/archive-files.sh

# Cache
redis-cli FLUSHALL
```

### Updates

1. **Sistema**
```bash
# Atualizar pacotes
apt update && apt upgrade

# Verificar segurança
apt-get install unattended-upgrades
```

2. **Aplicação**
```bash
# Deploy
/scripts/deploy.sh

# Migrations
npm run migrate
```

## Troubleshooting

### Problemas Comuns

1. **API Lenta**
```bash
# Verificar conexões
netstat -an | grep ESTABLISHED

# Verificar queries lentas
tail -f /var/log/postgresql/postgresql-slow.log
```

2. **Erro no ETL**
```bash
# Verificar arquivo
/scripts/validate-file.sh input.txt

# Reprocessar
/scripts/reprocess.sh --file input.txt
```

3. **Memória Alta**
```bash
# Análise de memória
free -m
ps aux --sort=-%mem | head

# Limpar cache
echo 3 > /proc/sys/vm/drop_caches
```

## Segurança

### Monitoramento

1. **Acessos**
```bash
# Tentativas de login
tail -f /var/log/auth.log

# Firewall
iptables -L
```

2. **Vulnerabilidades**
```bash
# Scan de portas
nmap -sS localhost

# Análise de dependências
npm audit
```

### Resposta a Incidentes

1. **Bloqueio**
```bash
# Bloquear IP
iptables -A INPUT -s IP-ADDRESS -j DROP

# Bloquear usuário
/scripts/block-user.sh USERNAME
```

2. **Investigação**
```bash
# Logs de segurança
grep ALERT /var/log/incanto/security.log

# Auditoria
aureport --start today
```

## Escalabilidade

### Recursos

1. **Vertical**
```bash
# Aumentar recursos
resize2fs /dev/sda1
```

2. **Horizontal**
```bash
# Adicionar node
/scripts/add-node.sh

# Balanceamento
nginx -s reload
```

### Performance

1. **Cache**
```bash
# Status do Redis
redis-cli info

# Limpar cache específico
redis-cli DEL cache:key
```

2. **Queries**
```bash
# Análise de queries
pg_stat_statements_reset();

# Otimização
VACUUM ANALYZE table_name;
```

## Métricas

### Coleta

1. **Sistema**
```bash
# Uso de recursos
collectd

# Logs de aplicação
filebeat
```

2. **Negócio**
```bash
# Transações
/scripts/metrics.sh transactions

# Usuários
/scripts/metrics.sh users
```

### Visualização

1. **Dashboards**
```bash
# Grafana
http://monitoring.incanto.com/grafana

# Kibana
http://monitoring.incanto.com/kibana
```

2. **Alertas**
```bash
# Configurar
/scripts/setup-alerts.sh

# Verificar
/scripts/check-alerts.sh
```

## Automação

### Scripts

1. **Manutenção**
```bash
# Limpeza diária
0 0 * * * /scripts/daily-maintenance.sh

# Backup semanal
0 0 * * 0 /scripts/weekly-backup.sh
```

2. **Monitoramento**
```bash
# Verificação de saúde
*/5 * * * * /scripts/health-check.sh

# Métricas
*/15 * * * * /scripts/collect-metrics.sh
```

## Documentação

### Registros

1. **Mudanças**
```bash
# Changelog
/scripts/update-changelog.sh

# Documentação
/scripts/update-docs.sh
```

2. **Incidentes**
```bash
# Registro
/scripts/log-incident.sh

# Relatório
/scripts/generate-report.sh
```
