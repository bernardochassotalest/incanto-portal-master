# Guia de Troubleshooting

## Problemas Comuns e Soluções

### 1. Problemas de API

#### API Lenta
**Sintomas:**
- Tempo de resposta > 2s
- Timeout em requisições

**Diagnóstico:**
```bash
# Verificar logs
tail -f /var/log/incanto/api.log | grep ERROR

# Monitorar conexões
netstat -an | grep ESTABLISHED | wc -l

# Verificar CPU/Memória
top -b -n 1
```

**Soluções:**
1. Limpar cache do Redis
2. Reiniciar PM2
3. Escalar horizontalmente

#### Erros 500
**Sintomas:**
- Erros internos do servidor
- Falhas em cascata

**Diagnóstico:**
```bash
# Logs de erro
pm2 logs --err

# Stack traces
tail -f /var/log/incanto/error.log
```

**Soluções:**
1. Verificar conexões de banco
2. Validar configurações
3. Rollback de deploy

### 2. Problemas de ETL

#### Falha no Processamento
**Sintomas:**
- Arquivo não processado
- Logs de erro no ETL

**Diagnóstico:**
```bash
# Validar arquivo
./validate-file.sh input.txt

# Verificar logs
tail -f /var/log/incanto/etl.log
```

**Soluções:**
1. Corrigir formato do arquivo
2. Reprocessar manualmente
3. Ajustar validações

#### Processamento Lento
**Sintomas:**
- Alto tempo de processamento
- Fila crescente

**Diagnóstico:**
```bash
# Status da fila
redis-cli LLEN etl:queue

# Monitorar recursos
htop
```

**Soluções:**
1. Aumentar workers
2. Otimizar batch size
3. Limpar filas antigas

### 3. Problemas de Banco de Dados

#### PostgreSQL Lento
**Sintomas:**
- Queries demoradas
- Timeout em operações

**Diagnóstico:**
```bash
# Queries ativas
SELECT * FROM pg_stat_activity;

# Índices
SELECT * FROM pg_stat_user_indexes;
```

**Soluções:**
1. VACUUM ANALYZE
2. Otimizar índices
3. Ajustar configurações

#### MongoDB Problemas
**Sintomas:**
- Conexões excedidas
- Alta latência

**Diagnóstico:**
```bash
# Status
db.serverStatus()

# Métricas
db.stats()
```

**Soluções:**
1. Ajustar pool de conexões
2. Otimizar índices
3. Compactar dados

### 4. Problemas de Frontend

#### Performance Ruim
**Sintomas:**
- Carregamento lento
- Alta utilização de CPU

**Diagnóstico:**
```bash
# Métricas do Chrome
chrome://tracing/

# Logs do cliente
console.log monitoring
```

**Soluções:**
1. Otimizar bundles
2. Implementar lazy loading
3. Ajustar cache

#### Erros de JavaScript
**Sintomas:**
- Console errors
- Funcionalidades quebradas

**Diagnóstico:**
```bash
# Logs do cliente
window.onerror monitoring

# Network issues
Chrome DevTools Network tab
```

**Soluções:**
1. Limpar cache do navegador
2. Verificar compatibilidade
3. Rollback de versão

### 5. Problemas de Infraestrutura

#### Alta Utilização de CPU
**Sintomas:**
- Sistema lento
- Processos travando

**Diagnóstico:**
```bash
# Top processos
top -b -n 1 | head -n 20

# Histórico de carga
sar -u 1 10
```

**Soluções:**
1. Identificar processos problemáticos
2. Ajustar recursos
3. Escalar infraestrutura

#### Problemas de Disco
**Sintomas:**
- Espaço insuficiente
- I/O lento

**Diagnóstico:**
```bash
# Uso de disco
df -h

# I/O stats
iostat -x 1 10
```

**Soluções:**
1. Limpar logs antigos
2. Arquivar dados
3. Adicionar storage

### 6. Problemas de Rede

#### Latência Alta
**Sintomas:**
- Conexões lentas
- Timeouts

**Diagnóstico:**
```bash
# Ping test
ping api.incanto.com

# Traceroute
mtr api.incanto.com
```

**Soluções:**
1. Verificar DNS
2. Ajustar timeouts
3. Mudar região

#### Problemas de DNS
**Sintomas:**
- Resolução falha
- Intermitência

**Diagnóstico:**
```bash
# DNS lookup
dig api.incanto.com

# DNS cache
nscd -g
```

**Soluções:**
1. Limpar cache DNS
2. Verificar registros
3. Mudar provedor DNS

## Prevenção

### Monitoramento Proativo

1. **Alertas**
```bash
# Configurar thresholds
/scripts/setup-alerts.sh

# Verificar status
/scripts/check-alerts.sh
```

2. **Métricas**
```bash
# Coletar dados
/scripts/collect-metrics.sh

# Análise
/scripts/analyze-metrics.sh
```

### Manutenção Preventiva

1. **Limpeza**
```bash
# Logs
/scripts/rotate-logs.sh

# Temporários
/scripts/clean-temp.sh
```

2. **Backup**
```bash
# Dados
/scripts/backup-data.sh

# Configurações
/scripts/backup-config.sh
```

## Recuperação

### Procedimentos de Emergência

1. **Rollback**
```bash
# Aplicação
/scripts/rollback.sh

# Banco de dados
/scripts/db-rollback.sh
```

2. **Restauração**
```bash
# Sistema
/scripts/restore-system.sh

# Dados
/scripts/restore-data.sh
```

### Documentação

1. **Incidentes**
```bash
# Registrar
/scripts/log-incident.sh

# Relatório
/scripts/generate-report.sh
```

2. **Lições Aprendidas**
```bash
# Atualizar docs
/scripts/update-docs.sh

# Treinar equipe
/scripts/schedule-training.sh
```
