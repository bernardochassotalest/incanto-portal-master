# Estrutura do Banco de Dados

## MongoDB

### Coleção: cielo_transacoes

Armazena os registros tipo D (transações) dos arquivos Cielo.

```javascript
{
  tipo_registro: String,          // Tipo do registro (D)
  numero_pv: String,             // Número do PV
  numero_documento: String,      // Número do documento
  data_lancamento: Date,        // Data do lançamento
  data_movimento: Date,         // Data do movimento
  tipo_lancamento: String,      // Tipo do lançamento (CREDITO, DEBITO, etc)
  valor_lancamento: Number,     // Valor do lançamento
  bandeira: String,            // Bandeira do cartão
  forma_pagamento: String,     // Forma de pagamento
  numero_parcela: Number,      // Número da parcela
  total_parcelas: Number,      // Total de parcelas
  numero_cartao: String,       // Número do cartão
  codigo_autorizacao: String,  // Código de autorização
  nsu: String,                // NSU
  valor_bruto: Number,        // Valor bruto
  valor_taxa: Number,         // Valor da taxa
  valor_liquido: Number,      // Valor líquido
  status_processamento: String, // Status do processamento
  motivo_rejeicao: String,    // Motivo de rejeição
  chave_ur: String           // Chave única do registro
}
```

### Coleção: cielo_pagamentos

Armazena os registros tipo E (pagamentos) dos arquivos Cielo.

```javascript
{
  tipo_registro: String,          // Tipo do registro (E)
  numero_pv: String,             // Número do PV
  nsu: String,                  // NSU
  data_lancamento: Date,        // Data do lançamento
  valor_total: Number,          // Valor total
  valor_parcela: Number,        // Valor da parcela
  pagamento_parcial: Boolean,   // Indica se é pagamento parcial
  data_prevista_pagamento: Date, // Data prevista para pagamento
  banco: String,               // Código do banco
  agencia: String,             // Número da agência
  conta: String,               // Número da conta
  status_pagamento: String,    // Status do pagamento
  motivo_rejeicao_pagamento: String, // Motivo de rejeição do pagamento
  chave_ur: String            // Chave única do registro
}
```

## PostgreSQL

### Tabela: users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: configurations

```sql
CREATE TABLE configurations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: audit_logs

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Índices

### MongoDB

```javascript
// cielo_transacoes
db.cielo_transacoes.createIndex({ "numero_pv": 1 });
db.cielo_transacoes.createIndex({ "data_lancamento": 1 });
db.cielo_transacoes.createIndex({ "nsu": 1 });
db.cielo_transacoes.createIndex({ "chave_ur": 1 }, { unique: true });
db.cielo_transacoes.createIndex({ "numero_pv": 1, "data_lancamento": 1 });

// cielo_pagamentos
db.cielo_pagamentos.createIndex({ "numero_pv": 1 });
db.cielo_pagamentos.createIndex({ "data_lancamento": 1 });
db.cielo_pagamentos.createIndex({ "nsu": 1 });
db.cielo_pagamentos.createIndex({ "chave_ur": 1 }, { unique: true });
db.cielo_pagamentos.createIndex({ "data_prevista_pagamento": 1 });
```

### PostgreSQL

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_configurations_key ON configurations(key);
```

## Backup e Recuperação

### MongoDB

Backup diário automatizado:
```bash
mongodump --db incanto --out /backup/mongo/$(date +%Y%m%d)
```

### PostgreSQL

Backup diário automatizado:
```bash
pg_dump incanto > /backup/postgres/incanto_$(date +%Y%m%d).sql
```

## Manutenção

### MongoDB

Rotinas de manutenção:
- Compactação de dados
- Verificação de índices
- Limpeza de dados antigos

### PostgreSQL

Rotinas de manutenção:
- VACUUM ANALYZE
- Atualização de estatísticas
- Reorganização de índices
