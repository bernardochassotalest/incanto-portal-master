process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();
global.PAGE_SIZE = process.env.PAGE_SIZE * 1

import MoongosePlugins from 'app/lib/connectors/mongoose-plugins'
MoongosePlugins()

import path from 'path';
import express from 'express';
import QueueAction from 'app/actions/queue';
import VindiAction from 'app/actions/vindi';
import NewcAction from 'app/actions/newc';
import SapB1Action from 'app/actions/sap-b1';
import MulticlubesAction from 'app/actions/multiclubes';
import SkillAction from 'app/actions/skill';
import BullBoard from 'bull-board';
import PostgresConnector from 'app/lib/connectors/postgres-connector';
import MongooseConnector from 'app/lib/connectors/mongoose-connector';
import Queue from 'app/lib/queue';
import upload from 'app/lib/upload'
import debug from 'debug';

const log = debug('incanto');

PostgresConnector(path.resolve(__dirname, 'app', 'models'));
MongooseConnector(path.resolve(__dirname, 'app', 'models'));

const app = express();
BullBoard.setQueues(Queue.queues.map(queue => queue.bull));

Queue.add('HealthCheck', {});

Queue.add('SkillReportsCron', {});
Queue.add('SkillAccountingCron', {});
Queue.add('SkillFinanceFilesCron', {});
Queue.add('SkillConciliationDates', {});

Queue.add('SapB1Pooling', {});
Queue.add('MulticlubesPooling', {});
Queue.add('VindiPooling', {});
Queue.add('VindiImportBatchesPooling', {});
Queue.add('VindiExportBatchesPooling', {});
//Queue.add('NewcPooling', {}); //TODO: Retornar após mapeamentos da Bilheteria

app.use(express.json());

app.post('/jobs/email/user-access', QueueAction.add('UserAccessEmail'));
app.post('/jobs/email/send', upload(), QueueAction.add('SendEmail'));

app.post('/jobs/skill/accounting/generate', SkillAction.accounting);
app.post('/jobs/skill/accounting/send', QueueAction.add('SkillAccountingSend'));
app.post('/jobs/skill/accounting/notification', QueueAction.add('SkillAccountingNotification'));
app.post('/jobs/skill/load-data/credit-card-balances', QueueAction.add('SkillLoadCreditCardBalances'));
app.post('/jobs/skill/conciliation/keys', QueueAction.add('SkillConciliationKeysWorker'));
app.post('/jobs/skill/finance-files/upload', upload(['txt','csv','cmp','ret']), SkillAction.uploadFiles);
app.post('/jobs/skill/finance-files/folder', QueueAction.add('SkillFinanceFilesFolder'));
app.post('/jobs/skill/finance-files/process', QueueAction.add('SkillFinanceFilesProcess'));
app.post('/jobs/skill/reports/process', QueueAction.add('SkillReportsProcess'));

app.post('/jobs/newc/pooling', NewcAction.pooling);
app.post('/jobs/newc/products', QueueAction.add('NewcProducts'));
app.post('/jobs/newc/clients', QueueAction.add('NewcClients'));
app.post('/jobs/newc/transactions', QueueAction.add('NewcTransactions'));

app.post('/jobs/vindi/pooling', VindiAction.pooling);
app.post('/jobs/vindi/products', QueueAction.add('VindiProducts'));
app.post('/jobs/vindi/customers', QueueAction.add('VindiCustomers'));
app.post('/jobs/vindi/bills', QueueAction.add('VindiBills'));
app.post('/jobs/vindi/transactions', QueueAction.add('VindiTransactions'));
app.post('/jobs/vindi/issues', QueueAction.add('VindiIssues'));
app.post('/jobs/vindi/payments', QueueAction.add('VindiPayments'));
app.post('/jobs/vindi/import-batches', QueueAction.add('VindiImportBatches'));
app.post('/jobs/vindi/export-batches', QueueAction.add('VindiExportBatches'));
app.post('/jobs/vindi/events', VindiAction.webhook);

app.post('/jobs/sap-b1/pooling', SapB1Action.pooling);
app.post('/jobs/sap-b1/costing-center', QueueAction.add('SapB1CostingCenter'));
app.post('/jobs/sap-b1/project', QueueAction.add('SapB1Project'));
app.post('/jobs/sap-b1/chart-of-account', QueueAction.add('SapB1ChartOfAccount'));
app.post('/jobs/sap-b1/business-partner', QueueAction.add('SapB1BusinessPartner'));
app.post('/jobs/sap-b1/journal-entry', QueueAction.add('SapB1JournalEntry'));

app.post('/jobs/multiclubes/pooling', MulticlubesAction.pooling);

app.use('/jobs/admin/queues', BullBoard.UI);

app.listen(process.env.HTTP_PORT, () => {
  log(`Server Jobs running on localhost:${process.env.HTTP_PORT}`);
});
