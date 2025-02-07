# Changelog

Todas as modificações significativas desse projeto serão documentadas nesse arquivo.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e os projetos vinculados a este repositório adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Seções para serem utilizadas:
```
ADDED - para novos recursos.
CHANGED - para alterações em recursos existentes.
DEPRECATED - para recursos que serão removidos nas próximas versões.
REMOVED -  para recursos removidos nesta versão.
FIXED - para qualquer correção de bug.
SECURITY - em caso de vulnerabilidades.
```

## [Unreleased]


## [v1.0.34](https://github.com/grupo-skill-sp/incanto/tree/v1.0.34) - 2024-03-13
### FIXED
- Corrigido tamanho maximo dos arquivos processados no job;

## [v1.0.33](https://github.com/grupo-skill-sp/incanto/tree/v1.0.33) - 2022-09-23
### CHANGED
- Conciliação manual indivialmente dos selecionados;

## [v1.0.32](https://github.com/grupo-skill-sp/incanto/tree/v1.0.32) - 2022-09-15
### CHANGED
- Processamento paliativo dos registros tipo 3 nos arquivos CIELO;
- Dados salvos no mongo mas não são relevantes no resto do processamento.

## [v1.0.31](https://github.com/grupo-skill-sp/incanto/tree/v1.0.31) - 2021-12-29
### CHANGED
- Parametrização e reprocessamento de retornos da conta 14722-1 do Multiclubes (Chamado: 59168);
- Incluído parametrizações do servidor no projeto para backup;

## [v1.0.30](https://github.com/grupo-skill-sp/incanto/tree/v1.0.30) - 2021-11-30
### CHANGED
- Revisão no chaveamento de forma de pagamento no envio de retornos para a Vindi (Chamado: 58681);

## [v1.0.29](https://github.com/grupo-skill-sp/incanto/tree/v1.0.29) - 2021-11-30
### CHANGED
- Alteração em forma de pagamento boleto para busca de dados da Vindi e cadastro de novas contas bancárias (Chamado: 58681);

## [v1.0.28](https://github.com/grupo-skill-sp/incanto/tree/v1.0.28) - 2021-11-03
### CHANGED
- Incluido tratamento para gerar informações de conciliação de capturas de venda com cartão na bilheteria (Chamado: 58137);

## [v1.0.27](https://github.com/grupo-skill-sp/incanto/tree/v1.0.27) - 2021-08-26
### CHANGED
- Incluido desvio de processamento de arquivos de liquidação da Cielo com tipo de transação 00 (Chamado: 56628);

## [v1.0.26](https://github.com/grupo-skill-sp/incanto/tree/v1.0.26) - 2021-07-16
### CHANGED
- Incluido verificação do status 02-Enviado para Banco no processamento de arquivos de liquidação da Cielo;

## [v1.0.25](https://github.com/grupo-skill-sp/incanto/tree/v1.0.25) - 2021-06-30
### CHANGED
- Ajustes para processamento de arquivos do layout 014 da Cielo;

## [v1.0.24](https://github.com/grupo-skill-sp/incanto/tree/v1.0.24) - 2021-06-08
### CHANGED
- Incluído bloqueio de captura de dados da API da NewC;

## [v1.0.23](https://github.com/grupo-skill-sp/incanto/tree/v1.0.23) - 2021-05-10
### FIXED
- Ajuste em visualização de informações de débito automático e tarifas de boletos para conciliação manual;
- Ajuste em parser de descrição de débito automático no extrato do Itaú (SEM PARAR);

## [v1.0.22](https://github.com/grupo-skill-sp/incanto/tree/v1.0.22) - 2021-04-30
### ADDED
- Processamento de estorno de PECLD para liquidação de boletos;

## [v1.0.21](https://github.com/grupo-skill-sp/incanto/tree/v1.0.21) - 2021-04-30

### ADDED
- Ajuste em visualização de conciliação do SAP Business One no Dashboard de acordo com configuração (Contábil/Financeira);

## [v1.0.20](https://github.com/grupo-skill-sp/incanto/tree/v1.0.20) - 2021-04-29
### ADDED
- Incluído coluna para informação de reconciliação externa;

## [v1.0.19](https://github.com/grupo-skill-sp/incanto/tree/v1.0.19) - 2021-04-29
### ADDED
- Processamento e contabilização de tarifas de Boletos do Itaú;
- Incluído campo Locked na carga de Centros de Custos do SAP Business One;
- Filtro por tags no relatório contábil;
- Logs de acesso de usuários (LGPD);

## [v1.0.18](https://github.com/grupo-skill-sp/incanto/tree/v1.0.18) - 2021-04-27
### ADDED
- Incluído visualização de contas contábeis conciliadas no SAP Business One;
- Revisão em filtro por tipos de datas (Venda/Lançamento/Vencimeto) no Dashboard;
- Incluído filtros nas telas de configuração contábil e mapeamento de itens;
- Correção em filtro da tela de relatório contábil;

## [v1.0.17](https://github.com/grupo-skill-sp/incanto/tree/v1.0.17) - 2021-04-19
### ADDED
- Documentação de sincronismo de arquivos dos agentes financeiros;
- Revisão na ordenação de processamento de datas abertas e conciliadas;

## [v1.0.16](https://github.com/grupo-skill-sp/incanto/tree/v1.0.16) - 2021-04-14
### ADDED
- Revisão no controle de saldo de liquidação da Rede;
- Controle de liquidação de transações antecipadas da Cielo e Rede;
- Upload automatizado de retornos do Itaú para a API da Vindi;

## [v1.0.15](https://github.com/grupo-skill-sp/incanto/tree/v1.0.15) - 2021-04-09
### ADDED
- Incluido controle de saldo de cartões por vendas;
- Verificação de liquidação de transações para Cielo e Rede;

## [v1.0.14](https://github.com/grupo-skill-sp/incanto/tree/v1.0.14) - 2021-04-08

### ADDED
- Ajuste em contabilização de captura de débito automático do Itaú para o Avanti;

## [v1.0.13](https://github.com/grupo-skill-sp/incanto/tree/v1.0.13) - 2021-04-08
### ADDED
- Ajuste em identificação de ocorrência de captura de débito automático do Itaú para o Avanti;

## [v1.0.12](https://github.com/grupo-skill-sp/incanto/tree/v1.0.12) - 2021-04-06
### ADDED
- Incluido parser/conciliação/contabilização de débito automático do Itaú para o Avanti;

## [v1.0.11](https://github.com/grupo-skill-sp/incanto/tree/v1.0.11) - 2021-03-25
### ADDED
- Incluido gravação de campos de nome e linha de arquivo procesado de adquirentes e extratos;
- Análise de queries e inclusão de indices auxiliares para tabelas;
- Correção em filtro de tags no dashboard (Detalhes de adquirentes);

## [v1.0.10](https://github.com/grupo-skill-sp/incanto/tree/v1.0.10) - 2021-03-24
### ADDED
- Telas de detalhes de erros de validação e dados de faturas;
- Tratamentos para faturas com crédito (parcial/estornos);
- Exportação em excel de transações conciliadas manualmente;
- Controle de log de páginas consultas na API da Vindi;

## [v1.0.9](https://github.com/grupo-skill-sp/incanto/tree/v1.0.9) - 2021-03-22
### FIXED
- Ajuste para contabilização faltante de não captura do dia 01/03/2021;

## [v1.0.8](https://github.com/grupo-skill-sp/incanto/tree/v1.0.8) - 2021-03-18
### CHANGED
- Exportação de créditos de clientes;
- Ajuste na expiração do token de login;

## [v1.0.7](https://github.com/grupo-skill-sp/incanto/tree/v1.0.7) - 2021-03-18
### CHANGED
- Detalhamentos de faturas no dashboard contábil;
- Imagens de documentação técnica do sistema;
- Bloqueios de edição de configurações;

## [v1.0.6](https://github.com/grupo-skill-sp/incanto/tree/v1.0.6) - 2021-03-11
### FIXED
- Detalhamento de faturas no dashboard contábil;
- Controle de acesso na tela de conciliação;

## [v1.0.5](https://github.com/grupo-skill-sp/incanto/tree/v1.0.5) - 2021-03-10
### FIXED
- Erro ao verificar período de processamento contábil;
- Visualização de informações de ingressos;

## [v1.0.4](https://github.com/grupo-skill-sp/incanto/tree/v1.0.4) - 2021-03-09
### CHANGED
- Incluído captura de informações da API da NewC (Bilheteria/Avanti);

## [v1.0.3](https://github.com/grupo-skill-sp/incanto/tree/v1.0.3) - 2021-02-24
### CHANGED
- Alterado parametro de busca de pagamentos do Multiclubes (A cada hora);

## [v1.0.2](https://github.com/grupo-skill-sp/incanto/tree/v1.0.2) - 2021-02-11
### ADDED
- Relatório em PDF de resumo contábil no dashboard;

## [v1.0.1](https://github.com/grupo-skill-sp/incanto/tree/v1.0.1) - 2021-02-11
### CHANGED
- Correção no controle de acesso de dados de vendas e créditos;

## [v1.0.0](https://github.com/grupo-skill-sp/incanto/tree/v1.0.0) - 2021-02-11
### ADDED
- Versão inicial de produção do Portal com Script;
