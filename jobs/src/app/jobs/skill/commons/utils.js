import _ from 'lodash'
import debug from 'debug';
import { md5, sizedField } from 'app/lib/utils'
import { postgres, mongodb } from 'app/models';
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:utils');

export const getCustomerId = async (sourceDb, code, transaction) => {
    let sourceId = _.toString(code), where = { sourceDb, sourceId },
        found = await postgres.CustomerReference.findOne({ where, raw: true }, {transaction});

    if (!found) {
        return ''
    }
    return _.get(found, 'customerId', '');
}

export const getCustomer = async (code, transaction) => {
    let id = _.toString(code), where = { id },
        found = await postgres.Customer.findOne({ where, raw: true }, {transaction});

    if (!found) {
        return {}
    }
    return found;
}

export const getFileData = async (params) => {
    try {
        const FileId = _.get(params, 'FileId', '');
        let fileInfo = await mongodb.cldr_files.loadByFileId(FileId);
        params['fileInfo'] = fileInfo;
        params['Status'] = 'success';
        params['ErrorMessage'] = '';
        fileInfo['Status'] = 'executing';
        await fileInfo.save();
    } catch (error) {
        throw error;
    }
    return params;
}

export const updateFileStatus = async (params) => {
    try {
        let fileInfo = _.get(params, 'fileInfo', '');
        if (_.isEmpty(fileInfo) == false) {
            fileInfo.ProcessDate = new Date();
            fileInfo.Status = _.get(params, 'Status', '');
            fileInfo.ErrorMessage = _.get(params, 'ErrorMessage', '');
            await fileInfo.save()
        }
    } catch (error) {
        throw error;
    }
    return params;
}

export const getTransactionKeys = (content) => {
    let result = {},
        pointOfSale = sizedField(_.get(content, 'PointOfSale', ''), 12),
        dateSale = _.get(content, 'Date', ''),
        nsu = sizedField(_.get(content, 'Nsu', ''), 12),
        tid = _.get(content, 'Tid', ''),
        reference = _.get(content, 'Reference', ''),
        authorization = _.get(content, 'Authorization', ''),
        batch = _.get(content, 'BatchGroup', ''),
        keyNsu = [],
        keyTid = [],
        keyAuthorization = [],
        keyReference = [];

    if (_.isEmpty(nsu) == false) {
        keyNsu.push(pointOfSale);
        keyNsu.push(dateSale);
        keyNsu.push(nsu);
        _.set(result, 'Nsu', keyNsu.join('-'));
        _.set(result, 'Id', md5(result.Nsu));
    }
    if (_.isEmpty(tid) == false) {
        tid = sizedField(tid, 20);
        keyTid.push(pointOfSale);
        keyTid.push(dateSale);
        keyTid.push(tid);
        _.set(result, 'Tid', keyTid.join('-'));
    }
    if (_.isEmpty(authorization) == false) {
        authorization = sizedField(authorization, 20);
        keyAuthorization.push(pointOfSale);
        keyAuthorization.push(dateSale);
        keyAuthorization.push(authorization);
        _.set(result, 'Authorization', keyAuthorization.join('-'));
    }
    if (_.isEmpty(reference) == false) {
        reference = sizedField(reference, 20);
        keyReference.push(pointOfSale);
        keyReference.push(dateSale);
        keyReference.push(reference);
        _.set(result, 'Reference', keyReference.join('-'));
    }
    if (_.isEmpty(batch) == false) {
        _.set(result, 'BatchGroup', batch)
    }

    return result;
}


export const loadPontoVenda = async (params) => {
    let tags = await postgres.PointOfSales.loadAll();

    params['tags'] = tags;
}

export const getTag = (tags, adquirente, nro_pv) => {
    let result = 'sep',
        filter = {
            'acquirer': _.toLower(_.trim(adquirente)),
            'code': _.padStart(_.trim(nro_pv), 12, '0')
        },
        found = _.find(tags, filter);

    if (_.isEmpty(found) == false) {
        result = _.get(found, 'tag', '')
    }

    return result;
}

export const loadPosConfig = async (params) => {
    let posConfig = await mongodb.cldr_pos_config.loadAll();

    params['posConfig'] = posConfig;
}

export const getPos = (posConfig, source, code) => {
    let result = {
            'Acquirer': { 'Code': 'not-found', 'Name': 'not-found' },
            'PointOfSale': 'not-found',
            'Bank': '',
            'Branch': '',
            'Account': '',
            'DigitAccount': '',
            'Tag': 'sep'
        },
        filter = {
            'Source': _.toLower(_.trim(source)),
            'Code': _.trim(_.toString(code))
        },
        found = _.find(posConfig, filter);

    if (_.isEmpty(found) == false) {
        result['Acquirer'] = _.get(found, 'Acquirer', '')
        result['PointOfSale'] = _.get(found, 'PointOfSale', '')
        result['Bank'] = _.get(found, 'Bank', '')
        result['Branch'] = _.get(found, 'Branch', '')
        result['Account'] = _.get(found, 'Account', '')
        result['DigitAccount'] = _.get(found, 'DigitAccount', '')
        result['Tag'] = _.get(found, 'Tag', '')
    }

    return result;
}

export const getAccountingConfig = async (model, source, item, date) => {
    var result = '';

    try {
        let found = await postgres.AccountConfigs.byKeys(model, source, item, date);

        if (found) {
            result = _.get(found, 'id', '');
        } else {
            let data = {
                    id: md5(`${model}-${source}-${item}-2000-01-01`),
                    model, source, item,
                    validFrom: '2000-01-01',
                    debAccount: accountingConfig.defaultAccount,
                    crdAccount: accountingConfig.defaultAccount,
                    isActive: false
                };
            await postgres.AccountConfigs.create(data);
            result = data.id;
        }
    } catch(err) {
        log(`Error: ${err} - ${model} - ${source} - ${item} - ${date}`);
        return '';
    }

    return result;
}
