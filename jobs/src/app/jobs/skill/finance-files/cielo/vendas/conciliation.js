import _ from 'lodash';
import { md5, sizedField } from 'app/lib/utils';
import fs from "fs";

const conciliationRecord = (model) => {
    let result = {}, content = {},
        modelId = _.get(model, '_id', ''),
        concRule = 'creditcard_capture',
        nroPv = _.get(model, 'estabelecimento', ''),
        transactionId = md5(`cielo-03-${modelId}`),
        id = md5(`${concRule}-cielo-${modelId}`);

    _.set(result, 'id', id);
    _.set(result, 'date', _.get(model, 'dt_apresentacao'));
    _.set(result, 'rule', concRule);
    _.set(result, 'sourceName', 'cielo');
    _.set(result, 'sourceDb', 'acquirerTransactions');
    _.set(result, 'sourceId', transactionId);
    _.set(result, 'pointOfSale', sizedField(nroPv, 12));
    _.set(result, 'keyCommon', _.get(model, '_keys.Authorization', ''));
    _.set(result, 'keyTid', _.get(model, '_keys.Tid', ''));
    _.set(result, 'keyNsu', _.get(model, '_keys.Nsu', ''));
    _.set(result, 'credit', _.get(model, 'vl_transacao'));
    _.set(result, 'balance', _.get(model, 'vl_transacao'));

    return result;
}

export const saveConciliation = async (params) => {
    try {
        const { parsed, broker } = params;
        const list = [];
        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                status_lancamento = _.get(model, 'status_lancamento', ''),
                registro = _.get(model, 'registro', '');
            // console.log(model);
            if ((registro == '2' || registro == 'E') && (status_lancamento == 'capturado')) {
                const record = conciliationRecord(model);
                if (list.find((row) => row.keyNsu === record.keyNsu)) continue;
                list.push(record);
                await broker.publish('incanto.Skill.ConciliationItems.Post', record);
            }
        }
        // const file = './lancamentos15.json';
        // fs.writeFileSync(file, JSON.stringify(list, '', 2), 'utf-8');
    } catch (error) {
        throw error;
    }

    return params;
}
