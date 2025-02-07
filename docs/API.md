# API Reference

## Autenticação

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

## Transações

### Listar Transações
```http
GET /api/transactions
```

**Query Parameters:**
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)
- `status`: string
- `page`: number
- `limit`: number

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "date": "string",
      "amount": "number",
      "status": "string",
      "type": "string"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

### Detalhes da Transação
```http
GET /api/transactions/:id
```

**Response:**
```json
{
  "id": "string",
  "date": "string",
  "amount": "number",
  "status": "string",
  "type": "string",
  "details": {
    "cardBrand": "string",
    "lastDigits": "string",
    "installments": "number"
  }
}
```

## ETL

### Upload de Arquivo
```http
POST /api/etl/upload
```

**Request Body:**
- `file`: File (multipart/form-data)

**Response:**
```json
{
  "id": "string",
  "filename": "string",
  "status": "string",
  "createdAt": "string"
}
```

### Status do Processamento
```http
GET /api/etl/status/:id
```

**Response:**
```json
{
  "id": "string",
  "status": "string",
  "progress": "number",
  "errors": ["string"],
  "completedAt": "string"
}
```

## Relatórios

### Gerar Relatório
```http
POST /api/reports
```

**Request Body:**
```json
{
  "type": "string",
  "startDate": "string",
  "endDate": "string",
  "format": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "string",
  "url": "string"
}
```

## Webhooks

### Configuração de Webhook
```http
POST /api/webhooks
```

**Request Body:**
```json
{
  "url": "string",
  "events": ["string"],
  "secret": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "active"
}
```

## Erros

### Códigos de Erro

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `500`: Internal Server Error

### Formato de Erro
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Rate Limiting

- Limite: 1000 requisições/hora
- Headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Versioning

A API usa versionamento via URL:
- V1: `/api/v1/`
- V2: `/api/v2/`

## Paginação

**Request:**
- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 20, max: 100)

**Response:**
```json
{
  "data": [],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
```

## Filtros

Formato geral:
```
GET /api/resource?field=value&field2[gt]=value2
```

Operadores:
- `gt`: Maior que
- `lt`: Menor que
- `gte`: Maior ou igual
- `lte`: Menor ou igual
- `ne`: Diferente
- `in`: Em array
- `nin`: Não em array

## Ordenação

```
GET /api/resource?sort=field,-field2
```
- Prefixo `-` para ordem descendente
- Múltiplos campos separados por vírgula

## Campos

```
GET /api/resource?fields=field1,field2
```
- Seleciona campos específicos
- Múltiplos campos separados por vírgula
