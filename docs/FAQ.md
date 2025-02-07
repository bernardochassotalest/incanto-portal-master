# Perguntas Frequentes (FAQ)

## Geral

### Q: O que é o Incanto Portal?
**R:** O Incanto Portal é uma plataforma integrada para processamento e gestão de transações financeiras, especializada no processamento de dados da Cielo. O sistema oferece funcionalidades completas para gerenciamento de vendas, pagamentos e antecipações.

### Q: Quais são os requisitos mínimos do sistema?
**R:** 
- CPU: 4+ cores
- RAM: 16GB+
- Armazenamento: 100GB+ SSD
- Sistema Operacional: Linux
- Node.js 14+
- PostgreSQL 12+
- MongoDB 4+

### Q: Como faço para começar a usar o sistema?
**R:** Siga o guia de instalação em `INSTALLATION.md` para configurar o ambiente e iniciar o sistema. O processo inclui configuração de banco de dados, variáveis de ambiente e dependências necessárias.

## Funcionalidades

### Q: Quais tipos de arquivos da Cielo são suportados?
**R:** Atualmente, o sistema suporta arquivos no formato Cielo v15.9. Os formatos incluem:
- Arquivos de vendas
- Arquivos de pagamentos
- Arquivos de chargebacks
- Arquivos de antecipação

### Q: Como funciona o processamento de arquivos?
**R:** O processamento segue estas etapas:
1. Upload do arquivo
2. Validação inicial
3. Processamento ETL
4. Persistência dos dados
5. Geração de relatórios

### Q: Quais relatórios estão disponíveis?
**R:** O sistema oferece:
- Relatórios de vendas
- Relatórios de conciliação
- Relatórios financeiros
- Dashboards personalizados
- Extratos detalhados

## Técnico

### Q: Como configurar múltiplos ambientes?
**R:** Use arquivos `.env` específicos para cada ambiente:
```bash
.env.development
.env.staging
.env.production
```

### Q: Como fazer backup dos dados?
**R:** Execute os scripts de backup:
```bash
# Backup completo
./scripts/backup.sh

# Backup específico
./scripts/backup.sh --type=postgres
```

### Q: Como monitorar o sistema?
**R:** Utilize as ferramentas integradas:
- Dashboard de monitoramento
- Logs do sistema
- Métricas de performance
- Alertas configuráveis

## Segurança

### Q: Como funciona a autenticação?
**R:** O sistema utiliza:
- JWT (JSON Web Tokens)
- Refresh tokens
- Autenticação em 2 fatores (opcional)
- Controle de sessão

### Q: Como são protegidos os dados sensíveis?
**R:** Através de:
- Criptografia em repouso
- SSL/TLS para transmissão
- Mascaramento de dados
- Controle de acesso granular

### Q: Qual é a política de backup?
**R:**
- Backup completo diário
- Backup incremental a cada 6 horas
- Retenção de 30 dias
- Teste mensal de restauração

## Problemas Comuns

### Q: O que fazer se o processamento ETL falhar?
**R:**
1. Verifique os logs em `/var/log/incanto/etl.log`
2. Valide o formato do arquivo
3. Execute o reprocessamento manual
4. Contate o suporte se necessário

### Q: Como resolver problemas de performance?
**R:**
1. Verifique uso de recursos
2. Otimize queries lentas
3. Ajuste configurações de cache
4. Escale recursos se necessário

### Q: O que fazer em caso de erro no login?
**R:**
1. Verifique credenciais
2. Limpe cache do navegador
3. Verifique bloqueio de conta
4. Contate administrador

## Desenvolvimento

### Q: Como contribuir com o código?
**R:**
1. Fork do repositório
2. Crie branch para feature
3. Siga padrões de código
4. Submeta pull request

### Q: Como adicionar novas funcionalidades?
**R:**
1. Documente a proposta
2. Desenvolva em ambiente de teste
3. Execute testes automatizados
4. Siga processo de deploy

### Q: Como debugar problemas?
**R:**
1. Use logs detalhados
2. Monitore métricas
3. Use ferramentas de debug
4. Consulte documentação

## Suporte

### Q: Como obter suporte?
**R:** Através dos canais:
- Email: suporte@incanto.com
- Telefone: (XX) XXXX-XXXX
- Portal: suporte.incanto.com
- Chat: chat.incanto.com

### Q: Qual é o SLA de suporte?
**R:**
- Crítico: 2 horas
- Alto: 4 horas
- Médio: 8 horas
- Baixo: 24 horas

### Q: Como reportar bugs?
**R:**
1. Documente o problema
2. Forneça logs relevantes
3. Descreva passos para reproduzir
4. Envie para suporte técnico

## Customização

### Q: É possível personalizar relatórios?
**R:** Sim, através de:
- Templates customizáveis
- Filtros personalizados
- Campos configuráveis
- Exportação flexível

### Q: Como adicionar novos tipos de arquivo?
**R:**
1. Crie novo parser
2. Configure validações
3. Defina mapeamentos
4. Teste processamento

### Q: É possível integrar com outros sistemas?
**R:** Sim, através de:
- APIs REST
- Webhooks
- Integrações customizadas
- Conectores específicos
