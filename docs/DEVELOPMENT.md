# Guia de Desenvolvimento

## Ambiente de Desenvolvimento

### Requisitos

- Node.js 14+
- PostgreSQL 12+
- MongoDB 4+
- Redis (opcional)
- Git

### Setup Inicial

1. **Clone do Repositório**
```bash
git clone https://github.com/your-org/incanto-portal.git
cd incanto-portal
```

2. **Instalação de Dependências**
```bash
# Backend
cd server
npm install

# Frontend
cd ../web
npm install

# ETL
cd ../etl
npm install
```

## Estrutura do Projeto

```
incanto-portal/
├── server/           # Backend Node.js
│   ├── src/
│   │   ├── actions/     # Handlers de API
│   │   ├── models/      # Modelos de dados
│   │   ├── libs/        # Bibliotecas compartilhadas
│   │   └── middlewares/ # Middlewares Express
│   └── tests/
├── web/             # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── services/   # Serviços e APIs
│   │   └── utils/      # Utilitários
│   └── tests/
├── etl/             # Sistema ETL
│   ├── src/
│   │   ├── parsers/    # Parsers de arquivo
│   │   ├── validators/ # Validadores
│   │   └── loaders/    # Carregadores de dados
│   └── tests/
└── docs/            # Documentação
```

## Padrões de Código

### JavaScript/Node.js

```javascript
// Nomenclatura
const CONSTANTS = 'UPPERCASE';
const camelCase = 'variables';
class PascalCase {}
function camelCase() {}

// Async/Await
async function getData() {
  try {
    const result = await service.fetch();
    return result;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

// Destructuring
const { id, name } = user;
const [first, ...rest] = items;

// Promises
return Promise.all([
  task1(),
  task2()
]).then(([result1, result2]) => {
  // handle results
});
```

### React

```javascript
// Componentes
const UserProfile = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div>
      {loading ? <Spinner /> : <UserData user={user} />}
    </div>
  );
};

// Hooks personalizados
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, error, loading };
};
```

## Git Flow

### Branches
- `main`: Produção
- `develop`: Desenvolvimento
- `feature/*`: Novas funcionalidades
- `bugfix/*`: Correções
- `release/*`: Preparação para release

### Commits
```bash
# Formato
<tipo>(<escopo>): <descrição>

# Exemplos
feat(auth): adiciona autenticação 2FA
fix(api): corrige validação de input
docs(readme): atualiza instruções de instalação
```

## Testes

### Backend
```javascript
// Jest + Supertest
describe('Auth API', () => {
  it('should authenticate user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

### Frontend
```javascript
// React Testing Library
describe('UserProfile', () => {
  it('should render user data', () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });
});
```

## CI/CD

### GitHub Actions
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

## Debugging

### Backend
```javascript
// Debug logs
const debug = require('debug')('app:api');
debug('Processing request', { id, data });

// Error handling
app.use((error, req, res, next) => {
  logger.error(error);
  res.status(500).json({
    error: {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  });
});
```

### Frontend
```javascript
// React DevTools
import { Debug } from 'components/Debug';

<Debug value={complexData} />

// Console
console.group('Render');
console.log('Props:', props);
console.log('State:', state);
console.groupEnd();
```

## Documentação

### JSDoc
```javascript
/**
 * Processa uma transação financeira
 * @param {Object} transaction - Dados da transação
 * @param {string} transaction.id - ID da transação
 * @param {number} transaction.amount - Valor da transação
 * @returns {Promise<Object>} Transação processada
 * @throws {ValidationError} Se dados inválidos
 */
async function processTransaction(transaction) {
  // implementation
}
```

### Swagger/OpenAPI
```yaml
paths:
  /transactions:
    post:
      summary: Cria nova transação
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Transaction'
      responses:
        '200':
          description: Transação criada
```

## Monitoramento

### Logs
```javascript
const logger = require('./logger');

logger.info('Operação iniciada', { userId, action });
logger.error('Falha no processo', { error, context });
```

### Métricas
```javascript
const metrics = require('./metrics');

metrics.increment('api.requests');
metrics.timing('db.query', timeInMs);
```

## Deploy

### Produção
```bash
# Build
npm run build

# Verificações
npm run lint
npm run test

# Deploy
npm run deploy
```

### Rollback
```bash
# Reverter para versão anterior
npm run rollback

# Verificar logs
npm run logs
```
