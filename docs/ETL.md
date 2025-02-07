# Documentação do Sistema ETL

## Visão Geral

O sistema ETL (Extract, Transform, Load) do Incanto Portal é responsável pelo processamento de arquivos de transações da Cielo, convertendo-os em dados estruturados para uso na plataforma.

## Arquitetura

### Componentes Principais

1. **Extrator (Extract)**
   - Leitura de arquivos Cielo v15.9
   - Validação de formato
   - Detecção de encoding
   - Controle de duplicidade

2. **Transformador (Transform)**
   - Normalização de dados
   - Mapeamento de códigos
   - Validação de regras de negócio
   - Enriquecimento de dados

3. **Carregador (Load)**
   - Persistência em PostgreSQL
   - Indexação em MongoDB
   - Gestão de transações
   - Controle de consistência

## Fluxo de Processamento

1. **Recebimento do Arquivo**
   ```
   Upload → Validação Inicial → Fila de Processamento
   ```

2. **Processamento ETL**
   ```
   Extração → Transformação → Validação → Carga
   ```

3. **Pós-processamento**
   ```
   Indexação → Notificação → Arquivamento
   ```

## Formatos de Arquivo

### Cielo v15.9

#### Estrutura do Arquivo
```
Header
Detalhe
Trailer
```

#### Tipos de Registro
- `0`: Header
- `1`: Detalhe
- `9`: Trailer

#### Campos Principais
```
Posição | Campo         | Formato | Tamanho
----------------------------------------------
001-001 | Tipo Registro| N       | 1
002-009 | Data         | N       | 8
010-019 | NSU          | N       | 10
020-021 | Bandeira     | A       | 2
```

## Mapeamentos

### Tipos de Lançamento
```javascript
const tipoLancamento = {
  'C': 'CREDITO',
  'D': 'DEBITO',
  'CC': 'CANCELAMENTO_CREDITO',
  'CD': 'CANCELAMENTO_DEBITO'
};
```

### Bandeiras
```javascript
const bandeiras = {
  '001': 'VISA',
  '002': 'MASTERCARD',
  '003': 'AMEX',
  '004': 'DINERS',
  '005': 'ELO',
  '006': 'HIPERCARD'
};
```

## Validações

### Arquivo
- Formato do nome
- Tamanho máximo
- Encoding
- Checksum

### Registros
- Tipo de registro válido
- Sequência correta
- Campos obrigatórios
- Formatos de campo

### Negócio
- Duplicidade de NSU
- Valores válidos
- Datas consistentes
- Totalizadores

## Configuração

### Variáveis de Ambiente
```env
ETL_BATCH_SIZE=1000
ETL_MAX_RETRIES=3
ETL_TIMEOUT=300
ETL_WORKERS=4
```

### Diretórios
```
/upload    # Arquivos recebidos
/process   # Em processamento
/done      # Processados com sucesso
/error     # Processados com erro
/archive   # Arquivados
```

## Monitoramento

### Métricas
- Arquivos processados
- Taxa de sucesso
- Tempo de processamento
- Uso de recursos

### Logs
```javascript
{
  "level": "info",
  "timestamp": "2024-01-01T00:00:00Z",
  "file": "example.txt",
  "stage": "transform",
  "message": "Processing started"
}
```

## Recuperação de Erros

### Tipos de Erro
1. **Temporários**
   - Retry automático
   - Backoff exponencial

2. **Permanentes**
   - Notificação
   - Arquivo para análise

### Estratégias
- Checkpoint a cada N registros
- Rollback em caso de erro
- Arquivo de backup

## Performance

### Otimizações
- Processamento em lotes
- Bulk insert
- Índices otimizados
- Cache de mapeamentos

### Limites
- Máximo de workers: 8
- Tamanho máximo de arquivo: 1GB
- Timeout: 5 minutos
- Batch size: 1000 registros

## Troubleshooting

### Problemas Comuns

1. **Arquivo Corrompido**
   ```bash
   # Verificar checksum
   md5sum arquivo.txt
   ```

2. **Erro de Processamento**
   ```bash
   # Verificar logs
   tail -f /var/log/etl/process.log
   ```

3. **Timeout**
   ```bash
   # Aumentar limite
   export ETL_TIMEOUT=600
   ```

## Scripts Úteis

### Reprocessamento
```bash
./reprocess.sh -f arquivo.txt -d 2024-01-01
```

### Validação
```bash
./validate.sh -f arquivo.txt
```

### Backup
```bash
./backup.sh -d /path/to/backup
```
