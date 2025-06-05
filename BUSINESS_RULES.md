# Regras de Negócio do Portal-Despacho

Este documento tem como objetivo registrar as regras de negócio que governam o funcionamento do sistema Portal-Despacho. Ele será construído e atualizado de forma incremental, à medida que o código-fonte for analisado e as funcionalidades do sistema forem compreendidas.

**Nota:** A identificação precisa das regras de negócio requer uma análise aprofundada do código ou informações diretas dos desenvolvedores/stakeholders do projeto.

## 1. Glossário de Termos

* **Despacho:** [**TODO:** Definir o que representa um "Despacho" no contexto do sistema.]
* [**TODO:** Adicionar outros termos de negócio relevantes.]

## 2. Entidades Principais e Seus Ciclos de Vida

* **Despacho:**
  * **Atributos:** [**TODO:** Listar os campos que compõem um despacho (ex: ID, data de criação, origem, destino, status, responsável, itens, documentos associados).]
  * **Estados Possíveis:** [**TODO:** Definir os diferentes estados pelos quais um despacho pode passar (ex: Registrado, Aguardando Coleta, Em Trânsito, Entregue, Cancelado, Com Pendência).]
  * **Transições de Estado:** [**TODO:** Descrever as regras que permitem a mudança de um estado para outro (ex: Um despacho "Registrado" só pode ir para "Aguardando Coleta" se todos os itens estiverem confirmados).]
* **Usuário:**
  * **Perfis/Papéis:** [**TODO:** Existem diferentes tipos de usuários? (ex: Administrador, Operador, Cliente). Quais as permissões de cada um?]
* [**TODO:** Identificar e descrever outras entidades importantes (ex: Cliente, Transportadora, Documento Fiscal).]

## 3. Processos de Negócio Principais

### 3.1. Criação de um Novo Despacho

* **Pré-condições:** [**TODO:** O que é necessário para iniciar a criação de um despacho?]
* **Dados Obrigatórios:** [**TODO:** Quais informações são indispensáveis?]
* **Validações:** [**TODO:** Quais verificações são feitas nos dados (ex: formato de CEP, existência de cliente, disponibilidade de itens)?]
* **Pós-condições:** [**TODO:** O que acontece após a criação bem-sucedida (ex: despacho recebe um ID, status inicial é "Registrado", notificação é enviada)?]

### 3.2. Atualização de Status de um Despacho

* **Gatilhos:** [**TODO:** O que pode causar uma atualização de status (ex: ação manual do operador, evento automático do sistema, integração com transportadora)?]
* **Regras por Status:** [**TODO:** Existem regras específicas para cada mudança de status? (ex: Para mudar para "Entregue", é necessário anexar comprovante).]
* **Notificações Associadas:** [**TODO:** Quem é notificado em cada mudança de status?]

### 3.3. Consulta e Rastreamento de Despachos

* **Critérios de Busca:** [**TODO:** Por quais campos os usuários podem buscar despachos?]
* **Visibilidade de Dados:** [**TODO:** Diferentes perfis de usuário veem informações diferentes?]

### 3.4. Processamento de XML (Se Aplicável a Regras de Negócio)

* **Tipos de XML:** [**TODO:** Quais tipos de documentos XML são processados (ex: NFe, CT-e, pedidos)?]
* **Regras de Validação de XML:** [**TODO:** O XML precisa seguir um schema específico? Quais campos são validados?]
* **Impacto no Negócio:** [**TODO:** Como o processamento de XML afeta os despachos ou outros processos?]

## 4. Regras de Notificação

* [**TODO:** Detalhar quando e para quem as notificações (web push ou outras) são enviadas.]
  * **Evento:** Novo Despacho Criado -> **Destinatários:** [Operador Responsável, Cliente]
  * **Evento:** Status do Despacho Alterado para "Em Trânsito" -> **Destinatários:** [Cliente]
  * **Evento:** Despacho Entregue -> **Destinatários:** [Cliente, Remetente]

## 5. Regras de Validação Geral

* [**TODO:** Listar regras de validação que se aplicam a múltiplos campos ou entidades (ex: Formato de datas, formato de e-mails, valores numéricos dentro de um range).]

## 6. Regras de Integração (Se Houver)

* [**TODO:** Se o sistema se integra com outros (ex: ERP, sistema de transportadora), descrever as regras que governam essas integrações.]

---

*Este documento é um trabalho em progresso. As regras de negócio serão adicionadas e refinadas conforme a análise do código e o entendimento do sistema evoluem.*
