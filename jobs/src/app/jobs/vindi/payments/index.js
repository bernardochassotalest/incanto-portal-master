import _ from 'lodash';
import debug from 'debug';
import { md5 } from 'app/lib/utils';
import { postgres } from 'app/models';
import Queue from 'app/lib/queue';

const log = debug('incanto:vindi:payments');

export default {
    key: 'VindiPayments',
    async handle({ data, broker }) {
        try {
            let executing = _.get(process, 'running_vindi', false);
            if (!executing) {
                process.running_vindi = true;

                log('Start: Geração de pagamentos da Vindi')

                await execute(broker);
            } else {
                log('Already executing');
            }
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};

const execute = async (broker) => {
    try {
        let charges = await postgres.VindiCharges.getForPayments();
        for (let i = 0; i < charges.length; i++) {
            await broker.publish('incanto.Skill.SalePayments.Post', charges[i]);
        }

        process.running_vindi = false;

        log('Finish: Geração de pagamentos da Vindi')
    } catch(err) {
        process.running_vindi = false;
        log(`Error: ${err}`);
    }
}
