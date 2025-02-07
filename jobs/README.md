# Business Jobs

.env.development

```
# Geral
PAGE_SIZE=20
HTTP_PORT=9995
CONFIRMATION_ACCOUNTS_EXPIRES_DAYS=1
DIR_ATTACHMENT=/tmp/attachments
NEW_USER_URL=http://localhost:3000
SEQUELIZE_LOG=none  #none/console/winston
TZ=America/Sao_Paulo

# Email
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=user@incanto.com.br
MAIL_PASS=PASSWORD
MAIL_SENDER=portaladministrativo@palmeiras.com.br
MAIL_SENDER_NAME=Sociedade Esportiva Palmeiras

# RabbitMQ Config
QUEUE_URL=amqp://administrator:Gr7p0Sk1ll1979@localhost:5672
QUEUE_LIMIT=100
QUEUE_PREFETCH=10

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DATABASE=9

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=Skill777
POSTGRES_DATABASE=dev-incanto

# MongoDb
MONGODB_URL=mongodb://localhost:27017/dev-incanto
MONGODB_RECONNECT_TRIES=10
MONGODB_RECONNECT_INTERVAL=1000
MONGODB_TIMEOUT=0
MONGODB_POOL_SIZE=5

# NewC
NEWC_CLIENTID=7
NEWC_APIKEY=LaUGpe6Y
NEWC_APIURL=https://palmeirastest.roboticket.com/apiskill/

# Vindi
VINDI_APIURL=https://sandbox-app.vindi.com.br/api/v1/
VINDI_APIKEY=_hKzLqWtwP37wtWn8GhRHYp3GkeIXVq-4OUhaWCqF5c
VINDI_UPDATED_UNTIL=

# Files
MULTER_STORAGE=/tmp/incanto-uploads
SERVER_FILES=/home/claudinei/incanto-files
VAN_COMPANY=nexxera
VAN_MAIL_ALERT=claudinei.cecilio.gruposkill@gmail.com

# Acquirers
ACQ_GROUP_ACCOUNTING=ponto_venda

# Accounting
DEFAULT_ACCOUNT=6.3.1.01.0001
```
