import _ from 'lodash'
import debug from 'debug';
import libAsync from 'async';
import Queue from 'app/lib/queue';
import { md5, sizedField, leftString, getTimeLog } from 'app/lib/utils'
import { mongodb, postgres } from 'app/models';
import { getDataFromAPI } from 'app/jobs/vindi/commons/utils'
import { enhanceTransaction } from 'app/jobs/vindi/commons/enhance'
import { getTransactionKeys, getPos } from 'app/jobs/skill/commons/utils'

const log = debug('incanto:vindi:transactions');

const workerQueue = libAsync.queue(({ data, broker }, done) => {
  log(`Vindi - Transactions - processing init`);

  handleApi(data, broker)
    .then((result) => {
      log(`Vindi - Transactions - processing done - result: ${result}`);
      done();
    })
}, 1);


const baseConciliationParser = (data, rule) => {
    let modelId = _.toString(_.get(data, 'id', '')),
        id = md5(`${rule}-vindi-${modelId}`),
        content = {};

    _.set(content, 'id', id);
    _.set(content, 'date', leftString(_.get(data, 'created_at', ''), 10));
    _.set(content, 'rule', rule);
    _.set(content, 'sourceName', 'vindi');
    _.set(content, 'sourceDb', 'vindiTransactions');
    _.set(content, 'sourceId', modelId);
    _.set(content, 'debit', _.get(data, 'amount'));
    _.set(content, 'balance', (-1 * _.get(data, 'amount')));
    _.set(content, 'pointOfSale', '');
    _.set(content, 'keyCommon', '');
    _.set(content, 'keyTid', '');
    _.set(content, 'keyNsu', '');

    return content;
}

const creditcardCapture = async (data, broker) => {
    let content = baseConciliationParser(data, 'creditcard_capture'),
        keys = _.get(data, 'creditcardKeys', {});

    _.set(content, 'pointOfSale', sizedField(keys.PointOfSale, 12));
    _.set(content, 'keyCommon', _.get(keys, 'Authorization', ''));
    _.set(content, 'keyTid', _.get(keys, 'Tid', ''));
    _.set(content, 'keyNsu', _.get(keys, 'Nsu', ''));

    await broker.publish('incanto.Skill.ConciliationItems.Post', content);
}

const directDebitCapture = async (data, broker) => {
    let content = baseConciliationParser(data, 'direct_debit_capture'),
        keys = _.get(data, 'directDebitKeys', '');

    _.set(content, 'keyCommon', _.get(keys, 'Common', ''));

    await broker.publish('incanto.Skill.ConciliationItems.Post', content);
}

const slipCapture = async (data, broker) => {
    let content = baseConciliationParser(data, 'slip_capture'),
        keys = _.get(data, 'slipKeys', '');

    _.set(content, 'keyCommon', _.get(keys, 'Common', ''));

    await broker.publish('incanto.Skill.ConciliationItems.Post', content);
}

const slipCanceled = async (data, broker) => {
    let content = baseConciliationParser(data, 'slip_canceled'),
        keys = _.get(data, 'slipKeys', '');

    _.set(content, 'date', leftString(_.get(data, 'updated_at', ''), 10));
    _.set(content, 'keyCommon', _.get(keys, 'Common', ''));

    await broker.publish('incanto.Skill.ConciliationItems.Post', content);
}

const GetTransactionHour = (info) => {
    let result = '',
        data = info || '';

    if (_.isEmpty(data) == false) {
        data =  _.split(data, 'T');
        if (_.size(data) > 1) {
            result = data[1].substr(0, 8);
        }
    }
    return result;
};

const savePostgres = async (data) => {
    const transaction = await postgres.VindiTransactions.sequelize.transaction();

    try {
        let authorization = _.get(data, 'gateway_response_fields.authorization_code', ''),
            nsu = _.get(data, 'gateway_response_fields.nsu', ''), cardNumber = '',
            firstSix = _.get(data, 'payment_profile.card_number_first_six', ''),
            lastFour = _.get(data, 'payment_profile.card_number_last_four', '');
        if (_.isEmpty(authorization) == true) {
            authorization = _.get(data, 'gateway_response_fields.authorizationCode', '');
        }
        if (_.isEmpty(authorization) == true) {
            authorization = _.get(data, 'gateway_authorization', '');
        }
        if (_.isEmpty(authorization) == true) {
            authorization = _.get(data, 'gateway_transaction_id', '');
        }
        if (_.isEmpty(nsu) == true) {
            nsu = _.get(data, 'gateway_response_fields.proof_of_sale', '');
        }
        if ((_.isEmpty(firstSix) == false) && (_.isEmpty(lastFour) == false)) {
            cardNumber = `${firstSix}******${lastFour}`;
        }

        let createDate = _.get(data, 'created_at', ''),
            paidDate = _.get(data, 'gateway_response_fields.credit_at', ''),
            model = {
                id: _.toString(_.get(data, 'id', '')),
                chargeId: _.toString(_.get(data, 'charge.id', '')),
                transactionType: _.get(data, 'transaction_type', ''),
                status: _.get(data, 'status', ''),
                createDate: leftString(createDate, 10),
                dueDate: _.get(data, 'gateway_response_fields.due_date', ''),
                paidDate: leftString((_.isEmpty(paidDate) === false ? paidDate : createDate), 10),
                paymentMethod: _.get(data, 'payment_method.code', ''),
                authorization: authorization,
                tid: _.get(data, 'gateway_response_fields.tid', ''),
                nsu: nsu,
                amount: _.get(data, 'amount', ''),

            },
            content = {
                type: (model.paymentMethod === 'credit_card' ? 'creditcard' : (model.paymentMethod === 'online_bank_slip' ? 'slip' : (model.paymentMethod === 'online_bank_slip_' ? 'slip' :(model.paymentMethod === 'bank_debit' ? 'directDebit' : 'none')))),
                amount: model.amount,
                slip: {
                    bank: _.get(data, 'posConfig.Bank', ''),
                    keyCommon: _.get(data, 'slipKeys.Common', ''),
                    barCode: _.get(data, 'gateway_response_fields.typeable_barcode', ''),
                    slipNumber: model.authorization,
                    ourNumber: model.authorization,
                },
                creditCard: {
                    acquirer: _.get(data, 'posConfig.Acquirer.Code', ''),
                    pointOfSale: _.get(data, 'posConfig.PointOfSale', ''),
                    keyCommon: _.get(data, 'creditcardKeys.Authorization', ''),
                    keyNsu: _.get(data, 'creditcardKeys.Nsu', ''),
                    keyTid: _.get(data, 'creditcardKeys.Tid', ''),
                    time: GetTransactionHour(createDate),
                    tid: model.tid,
                    nsu: model.nsu,
                    authorization: model.authorization,
                    cardNumber: cardNumber,
                    cardBrand: _.get(data, 'payment_profile.payment_company.name', ''),
                    holderName: _.get(data, 'payment_profile.holder_name', ''),
                },
                directDebit: {
                    keyCommon: _.get(data, 'directDebitKeys.Common', ''),
                    bank: _.get(data, 'posConfig.Bank', ''),
                    branch: _.get(data, 'payment_profile.bank_branch', ''),
                    account: _.get(data, 'payment_profile.bank_account', ''),
                    vatNumber: _.get(data, 'payment_profile.registry_code', ''),
                    holderName: _.get(data, 'payment_profile.holder_name', ''),
                    debitNumber: model.authorization,
                }
            };

        model['content'] = JSON.stringify(content);

        await postgres.VindiTransactions.upsert(model, { transaction });

        await transaction.commit();
    } catch(err) {
        await transaction.rollback(); log(`Error: ${err}`);
    }
}

const setCreditcardKeys = (data) => {
    let baseKeys = {
            'PointOfSale': _.get(data, 'posConfig.PointOfSale', ''),
            'Date': leftString(_.get(data, 'created_at', ''), 10),
            'Nsu': _.get(data, 'gateway_response_fields.proof_of_sale', ''),
            'Tid': _.get(data, 'gateway_response_fields.tid', ''),
            'Authorization': _.get(data, 'gateway_response_fields.authorization_code', ''),
            'Reference': _.toString(_.get(data, 'id', ''))
        };

    if (_.isEmpty(baseKeys.Nsu) == true) {
        baseKeys['Nsu'] = _.get(data, 'gateway_response_fields.nsu', '')
    }
    if (_.isEmpty(baseKeys.Authorization) == true) {
        baseKeys['Authorization'] = _.get(data, 'gateway_response_fields.authorizationCode', '')
        if (_.isEmpty(baseKeys.Authorization) == true) {
            baseKeys['Authorization'] = _.get(data, 'gateway_authorization', '')
        }
    }

    let keys = getTransactionKeys(baseKeys),
        result = { PointOfSale: baseKeys.PointOfSale, ...keys };

    return result;
}

const setSlipKeys = (data) => {
    let keyCommon = [],
        config = {
            'banco': _.get(data, 'posConfig.Bank', ''),
            'agencia': _.get(data, 'posConfig.Branch', ''),
            'conta_corrente': _.get(data, 'posConfig.Account', ''),
        };

    keyCommon.push(sizedField(_.get(config, 'banco', ''), 3));
    keyCommon.push(sizedField(_.get(config, 'agencia', ''), 5));
    keyCommon.push(sizedField(_.get(config, 'conta_corrente', ''), 10));
    keyCommon.push(sizedField(_.get(data, 'gateway_authorization', ''), 15));

    return { Common: _.join(keyCommon, '-') };
}

const setDirectDebitKeys = (data) => {
    let keyCommon = [],
        config = {
            'banco': _.get(data, 'posConfig.Bank', ''),
            'agencia': _.get(data, 'posConfig.Branch', ''),
            'conta_corrente': _.get(data, 'posConfig.Account', ''),
        };

    keyCommon.push(sizedField(_.get(config, 'banco', ''), 3));
    keyCommon.push(sizedField(_.get(config, 'agencia', ''), 5));
    keyCommon.push(sizedField(_.get(config, 'conta_corrente', ''), 10));
    keyCommon.push(sizedField(_.get(data, 'gateway_transaction_id', ''), 15));

    return { Common: _.join(keyCommon, '-') };
}

const handleData = async (data, broker) => {
    let posConfig = await mongodb.cldr_pos_config.loadAll();
    for (var i = 0; i < data.length; i++) {
        let item = data[i],
            id = String(_.get(item, 'id', '')),
            filter = { '_id': id },
            model = { '_id': id, 'content': item },
            transactionType = _.get(item, 'transaction_type', ''),
            paymentMethod = _.get(item, 'payment_method.code', ''),
            status = _.get(item, 'status', ''),
            enhance = await enhanceTransaction(item);

        item['timeLog'] = getTimeLog();
        let record = mongodb.sales_vindi_transactions.findOne(filter)
        if (!record) {
            let model = { '_id': id, 'content': item, 'enhance': enhance, 'history': [item] },
                instance = new mongodb.sales_vindi_transactions(model);
            await instance.save()
        } else {
            let update = { $push: { history: item }, $set: { content: item, enhance: enhance } },
                options = { upsert: true };
            await mongodb.sales_vindi_transactions.findOneAndUpdate(filter, update, options);
        }
        item['posConfig'] = getPos(posConfig, 'vindi', _.get(item, 'gateway.id', ''));
        item['slipKeys'] = setSlipKeys(item);
        item['directDebitKeys'] = setDirectDebitKeys(item);
        item['creditcardKeys'] = setCreditcardKeys(item);
        if ((transactionType === 'capture') && (status === 'success')) {
            await savePostgres(item);
            await creditcardCapture(item, broker);
        }
        if (transactionType === 'charge') {
            if ((status === 'success') || (status == 'waiting')) {
                await savePostgres(item);
                if (_.includes(paymentMethod, 'slip') == true) {
                    await slipCapture(item, broker);
                }
                if (_.includes(paymentMethod, 'bank_debit') == true) {
                    await directDebitCapture(item, broker);
                }
            }
            if ((status === 'canceled') && (_.includes(paymentMethod, 'slip') == true)) {
                await savePostgres(item);
                await slipCapture(item, broker);
                await slipCanceled(item, broker);
            }
        }
    }
}

const handleApi = async (pooling, broker) => {
    log(`Starting Pooling`);

    try {
        const ok = await getDataFromAPI('transactions', pooling, handleData, broker);
        if (ok) {
          await postgres.Pooling.saveStart('vindi-transactions');

          Queue.add('VindiIssues', {});
        }

        process.running_vindi = false;
    } catch(err) {
        log(`Error while process transactions: ${err}`)
        process.running_vindi = false;
        return false;
    }

    return true;
};

export default {
    process({ data, broker }) {
        workerQueue.push({ data, broker })
    }
};
