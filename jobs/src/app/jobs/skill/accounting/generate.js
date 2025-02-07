import _ from 'lodash';
import fs from 'fs'
import debug from 'debug';
import Queue from 'app/lib/queue';
import { v4 as uuidv4 } from 'uuid';
import { postgres } from 'app/models';
import { validateMapping, validateAccountConfig, revenuesAccounting, creditCardSaleId, slipSaleId, directDebitSaleId,
         vindiCreditsGenerate, creditCardAccounting, creditReverseAccounting, slipAccounting, directDebitAccounting,
         billCreditAccounting, issuesAccounting, notCapturedAccounting, pecldAccounting, pecldRevertAccounting,
         canceledAccounting, generateAccounting } from './business'
import { md5, removeFile, createFolder, isLastDayOfMonth, delay } from 'app/lib/utils'
import acctConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:generate');

export default {
  key: 'SkillAccountingGenerate',
  async handle({ data, broker }) {
    let PIPE_FOLDER = process.env.DIR_ATTACHMENT,
      filePipe = `${PIPE_FOLDER}/running_accounting.pipe`;

    try {
      await createFolder(PIPE_FOLDER);

      if (fs.existsSync(filePipe)) {
        log('Already executing');
      } else {
        log('Iniciando processamento');
        fs.writeFileSync(filePipe, 'executing');

        await runCanceledKeys(broker);
        await runConciliation(broker);
        await runChangeStatus();
        await runSettlementSaleIds(broker);
        await runAccounting(broker);

        if (fs.existsSync(filePipe)) {
          await removeFile(filePipe)
        }
        log('Processamento Finalizado');
      }
    } catch (err) {
        log(`Error: ${err}`)
        if (fs.existsSync(filePipe)) {
          await removeFile(filePipe)
        }
    }
  }
};

const runCanceledKeys = async (broker) => {
  log(`Gerando as Chaves de Cancelamento de Boletos Pagos`);

  let list = await postgres.ConciliationItems.listCanceledKeys();

  for (let i = 0; i < list.length; i++) {
    let item = list[i],
      concRule = 'slip_canceled',
      concDate = _.get(item, 'date', ''),
      occurrence = _.first(_.get(item, 'slipTrans.occurrences', [])),
      modelId = _.get(occurrence, 'id', ''),
      creditDate = _.get(occurrence, 'date', ''),
      bankName =_.toLower(_.deburr( _.get(item, 'slipTrans.bankData.nick', ''))),
      amount = _.get(item, 'debit', 0),
      model = {
        id: md5(`${concRule}-${bankName}-${modelId}`),
        date: concDate,
        rule: concRule,
        sourceName: bankName,
        sourceDb: 'slipOccurrences',
        sourceId: modelId,
        pointOfSale: '',
        keyCommon: _.get(item, 'keyCommon', ''),
        keyTid: '',
        keyNsu: `CREDIT_AT: ${creditDate}`,
        debit: 0,
        credit: amount,
        balance: amount,
      };
    await postgres.ConciliationItems.upsert(model);
  }
}

const runConciliation = async (broker) => {
  log(`Gerando as Chaves de Conciliação`);

  let grouped = [],
    keysNsu = await postgres.ConciliationItems.listKeysNsu(),
    keysCommon = await postgres.ConciliationItems.listKeysCommon();

  grouped = _.concat(grouped, _.values(_.groupBy(keysNsu, function(o) { return `${o.rule}-${o.keyNsu}` })));
  grouped = _.concat(grouped, _.values(_.groupBy(keysCommon, function(o) { return `${o.rule}-${o.keyCommon}` })));

  for (let j = 0; j < grouped.length; j++) {
    let group = _.uniqBy(grouped[j], 'id'),
      conciliationId = uuidv4();

    for (let k = 0; k < group.length; k++) {
      let item = group[k],
        model = {
          conciliationItemId: _.get(item, 'id', ''),
          keyId: conciliationId,
          isManual: 'false',
          userId: acctConfig.adminUser,
          notes: ''
        };
        await broker.publishBuffer('incanto.Skill.ConciliationKeys.Post', model)
    }
  }
}

const runChangeStatus = async () => {
  let currentDate = await postgres.Conciliations.listOpened();
  if (_.isEmpty(currentDate) == false) {
    let countContent = await postgres.ConciliationItems.countContent(currentDate),
      countConcilied = await postgres.ConciliationItems.countConcilied(currentDate);
    if ((countContent > 0) && (countConcilied <= 0)) {
      log(`Alterado o status de aberto para conciliado [${currentDate}]`);
      let result = await postgres.Conciliations.changeStatus(currentDate, 'concilied');
    }
  }

  let conciliedDates = await postgres.Conciliations.listConcilied();
  if (_.isEmpty(conciliedDates) == false) {
    for (let i = 0; i < conciliedDates.length; i++) {
      let currentDate = _.get(conciliedDates[i], 'date', ''),
        countSales = await postgres.SaleItems.countAccounting(currentDate),
        countAcctItem = await postgres.AccountingItems.countAccounting(currentDate),
        countLCM = await postgres.JournalVouchers.countClosed(currentDate);
      if ((countSales + countAcctItem + countLCM) <= 0) {
        log(`Alterado o status de conciliado para fechado [${currentDate}]`);
        let result = await postgres.Conciliations.changeStatus(currentDate, 'closed');
      }
    }
  }
}

const runSettlementSaleIds = async(broker) => {
  log('Atualizando vendas liquidadas');

  let list = await postgres.AcquirerSettlements.listSaleId();
  for (let i = 0; i < list.length; i++) {
    let data = list[i];
    data['saleAccountingId'] = md5(`${data.saleId}-${data.accountingItemId}`);
    await broker.publish('incanto.Skill.AcquirerSettlement.Post', data);
  }
}

const runAccounting = async (broker) => {
  let rows = await postgres.Conciliations.listConcilied(),
    refDate = _.get(_.first(rows), 'date', '');

  if (_.isEmpty(refDate) == false) {
    log(`Gerando dados contábeis: ${refDate}`);

    let qtyMapping = await validateMapping(refDate);
    if (qtyMapping > 0) {
      Queue.add('SkillAccountingNotification', {});
    } else {
      let qtyRevenues = await revenuesAccounting(refDate, broker);
      await creditCardSaleId(refDate);
      await slipSaleId(refDate);
      await directDebitSaleId(refDate);
      await vindiCreditsGenerate(refDate);
      let qtyCreditcard = await creditCardAccounting(refDate, broker);
      let qtySlip = await slipAccounting(refDate, broker);
      let qtyDebit = await directDebitAccounting(refDate, broker);
      let qtyCredit = await billCreditAccounting(refDate, broker);
      let qtyRevCrd = await creditReverseAccounting(refDate, broker);
      let qtyIssues = await issuesAccounting(refDate, broker);
      if ((qtyRevenues + qtyCreditcard + qtySlip + qtyDebit + qtyCredit + qtyRevCrd + qtyIssues) <= 0) {
        let qtyNotCaptured = await notCapturedAccounting(refDate, broker);
        if (qtyNotCaptured <= 0) {
          let qtyCanceled = await canceledAccounting(refDate, broker);
          if (qtyCanceled <= 0) {
            let qtyRevertPecld = await pecldRevertAccounting(refDate, broker), qtyPecld = 0;
            if (isLastDayOfMonth(refDate) === true) {
              qtyPecld = await pecldAccounting(refDate, broker);
            }
            if ((qtyPecld + qtyRevertPecld) <= 0) {
              let qtyAcctConfig = await validateAccountConfig(refDate);
              if (qtyAcctConfig > 0) {
                Queue.add('SkillAccountingNotification', {});
              } else {
                await generateAccounting(refDate, broker);
                Queue.add('SkillAccountingSend', { refDate });
              }
            }
          }
        }
      }
    }
  }
}
