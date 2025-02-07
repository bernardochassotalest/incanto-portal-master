import _ from 'lodash';
import debug from 'debug';
import { postgres } from 'app/models';
import { publishSapB1 } from 'app/lib/utils'

const log = debug('incanto:multiclubes:logs');

export default {
    key: 'MulticlubesFinancialLog',
    async handle({ data, broker }) {
        let cronMinute = (new Date()).getMinutes();
        if (cronMinute > 10) {
          log('Getting Data');

          let poolingLog = await postgres.Pooling.getStart('multiclubes-financial-log'),
            poolingSales = await postgres.Pooling.getStart('multiclubes-sales'),
            poolingPayments = await postgres.Pooling.getStart('multiclubes-payments'),
            logDate = _.get(poolingLog, 'startDate', ''),
            saleDate = _.get(poolingSales, 'startDate', ''),
            paymentDate = _.get(poolingPayments, 'startDate', ''),
            paymentCycle = _.get(poolingPayments, 'startCycle') || '00';

          if (logDate != saleDate) {
            log(`Sales From: ${saleDate}`);
            publishSapB1(broker, 'MulticlubesSales', 'Get', { 'StartDate': saleDate });
            await postgres.Pooling.saveLastDate('multiclubes-sales', logDate);
          }

          log(`Payments From: ${paymentDate} - ${paymentCycle}`);
          publishSapB1(broker, 'MulticlubesPayments', 'Get', { 'StartDate': paymentDate, 'StartCycle': paymentCycle });
          await postgres.Pooling.saveStart('multiclubes-payments');
        } else {
          publishSapB1(broker, 'MulticlubesFinancialLog', 'Get', { execute: true });
          log('Ok');
        }
    }
};
