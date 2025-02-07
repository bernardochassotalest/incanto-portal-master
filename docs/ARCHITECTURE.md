# Arquitetura do Sistema Incanto

## Visão Geral

O Incanto é um sistema distribuído composto por vários módulos especializados, cada um com sua responsabilidade específica. A arquitetura foi projetada para ser escalável, manutenível e resiliente.

## Componentes Principais

### 1. Servidor Backend (`/server`)

O backend é uma aplicação Node.js que fornece APIs RESTful e gerencia a lógica de negócios principal.

**Tecnologias Principais:**
- Node.js
- Express
- Sequelize ORM
- MongoDB
- Socket.IO para comunicação em tempo real

**Características:**
- Arquitetura baseada em APIs RESTful
- Autenticação via JWT
- Integração com múltiplos bancos de dados
- Sistema de logging estruturado
- Gerenciamento de processos via PM2

### 2. Frontend Web (`/web`)

Interface web moderna e responsiva construída com React.

**Tecnologias Principais:**
- React
- JavaScript moderno
- Gerenciamento de estado
- Sistema de componentes reutilizáveis

**Características:**
- Design responsivo
- Interface moderna e intuitiva
- Otimização de performance
- Componentização

### 3. ETL (Extract, Transform, Load) (`/etl`)

Sistema responsável pelo processamento e integração de dados de diferentes fontes.

**Módulos Principais:**
- Processador Cielo (v15.9)
- Gerenciamento de vendas
- Processamento de pagamentos
- Sistema de antecipação
- Controle de saldos

**Características:**
- Processamento assíncrono
- Validação robusta de dados
- Mapeamento de diferentes formatos
- Sistema de logging e monitoramento

### 4. Jobs (`/jobs`)

Sistema de processamento em background para tarefas agendadas e assíncronas.

**Funcionalidades:**
- Processamento em lote
- Tarefas agendadas
- Rotinas de manutenção
- Geração de relatórios

### 5. DevOps (`/devops`)

Infraestrutura e automação de deploy.

**Componentes:**
- Scripts de deploy
- Configurações de ambiente
- Monitoramento
- Backup e recuperação

## Fluxo de Dados

### Processamento de Arquivos Cielo

1. **Recebimento do Arquivo**
   - Upload via API
   - Validação inicial do formato

2. **Processamento ETL**
   ```
   Arquivo → Parser → Validação → Transformação → Persistência
   ```

3. **Armazenamento**
   - MongoDB para dados processados
   - Sistema de backup

### Fluxo de Vendas

1. **Captura de Venda**
   - API REST
   - Validação em tempo real

2. **Processamento**
   - Validação de regras de negócio
   - Cálculo de taxas e valores

3. **Persistência**
   - Armazenamento em banco relacional
   - Logs de auditoria

## Banco de Dados

### MongoDB

**Coleções Principais:**
- `cielo_transacoes`: Registros tipo D
- `cielo_pagamentos`: Registros tipo E
- `vendas`: Dados de vendas
- `usuarios`: Informações de usuários

**Índices Otimizados para:**
- Consultas por período
- Busca por PV
- Agregações financeiras

### PostgreSQL

**Tabelas Principais:**
- Dados transacionais
- Informações de conta
- Configurações do sistema

## Segurança

### Autenticação
- JWT (JSON Web Tokens)
- Controle de sessão
- Níveis de acesso

### Dados
- Criptografia em trânsito (HTTPS)
- Dados sensíveis criptografados
- Logs de auditoria

## Monitoramento

### Métricas
- Performance de APIs
- Tempo de processamento ETL
- Uso de recursos

### Logs
- Logs estruturados
- Rastreamento de erros
- Auditoria de ações

## Deploy

### Ambientes
- Desenvolvimento
- Homologação
- Produção

### Processo
1. Build automatizado
2. Testes automatizados
3. Deploy via script
4. Verificações pós-deploy

## Escalabilidade

### Horizontal
- Múltiplas instâncias de API
- Balanceamento de carga
- Cache distribuído

### Vertical
- Otimização de recursos
- Ajuste fino de configurações
- Monitoramento de performance

## Próximos Passos

1. **Melhorias de Performance**
   - Implementar cache distribuído
   - Otimizar queries
   - Melhorar processamento em lote

2. **Segurança**
   - Implementar 2FA
   - Melhorar monitoramento de segurança
   - Atualizar dependências

3. **Infraestrutura**
   - Containerização com Docker
   - Orquestração com Kubernetes
   - CI/CD automatizado

4. **Monitoramento**
   - APM (Application Performance Monitoring)
   - Dashboards em tempo real
   - Alertas automáticos
