#!/bin/bash
cd prd-tables
pg_dump --data-only -t '"profiles"'  incanto > "profiles.sql"
pg_dump --data-only -t '"users"'  incanto > "users.sql"
pg_dump --data-only -t '"cancellationModels"'  incanto > "cancellationModels.sql"
pg_dump --data-only -t '"customers"'  incanto > "customers.sql"
pg_dump --data-only -t '"customerReferences"'  incanto > "customerReferences.sql"
pg_dump --data-only -t '"chartOfAccounts"'  incanto > "chartOfAccounts.sql"
pg_dump --data-only -t '"bpGroups"'  incanto > "bpGroups.sql"
pg_dump --data-only -t '"businessPartners"'  incanto > "businessPartners.sql"
pg_dump --data-only -t '"costingCenters"'  incanto > "costingCenters.sql"
pg_dump --data-only -t '"projects"'  incanto > "projects.sql"
pg_dump --data-only -t '"reportTemplates"'  incanto > "reportTemplates.sql"
pg_dump --data-only -t '"reportTemplateItems"'  incanto > "reportTemplateItems.sql"
pg_dump --data-only -t '"reportTemplateAccounts"'  incanto > "reportTemplateAccounts.sql"
pg_dump --data-only -t '"accountConfigs"'  incanto > "accountConfigs.sql"
pg_dump --data-only -t '"sourceItems"'  incanto > "sourceItems.sql"
pg_dump --data-only -t '"sourceMappings"'  incanto > "sourceMappings.sql"
cd ..

DATE=$(date -u "+%F-%H%M%S")
FILE_NAME="incanto-tables-${DATE}.tgz"

tar -zvcf ${FILE_NAME} prd-tables
echo "${FILE_NAME}"