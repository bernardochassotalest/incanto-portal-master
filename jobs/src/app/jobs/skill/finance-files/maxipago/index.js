import _ from 'lodash'
import fs from 'fs'
import chardet from 'chardet';
import libAsync from 'async';
import { mongodb } from 'app/models'
import { publishSapB1 } from 'app/lib/utils'
import { md5, stringDate, sizedField, replaceEscape } from 'app/lib/utils'
import { getFileData, updateFileStatus } from 'app/jobs/skill/commons/utils'

const charSetDetector = (params) => {
    return new Promise((resolve, reject) => {
        let fullPath = _.get(params, 'fileInfo.FullPath', '');

        chardet.detectFile(fullPath, function(err, encoding) {
            params['charset'] = encoding;

            return resolve(params);
        })
    })
};

const parserRecord = (params) => {
    let result = {},
        { line, lineNumber, matches } = params,
        temp = _.split(line, ','),
        companyName = replaceEscape(temp[20]),
        splited = _.split(companyName, '-'),
        championship = {},
        match = {};

    if (_.size(splited) == 4) {
        _.set(championship, 'Code', 'FCARD-' + sizedField(splited[2], 3));
        _.set(championship, 'Name', splited[3]);
        _.set(match, 'Code', 'FCARD-' + sizedField(splited[0], 7));
        _.set(match, 'Name', splited[1]);
        _.set(match, 'Championship', championship);

        let filter = { 'Key': match.Code },
            found = _.find(matches, filter);
        if (!found) {
            matches.push({'Key': match.Code, 'Match': match, 'Championship': championship});
        }
    }

    _.set(result, '_id', md5(line));
    _.set(result, 'nro_linha', lineNumber)
    _.set(result, 'MERCHANT_ID', temp[0])
    _.set(result, 'TRANSACTION_ID', temp[1])
    _.set(result, 'ORDER_ID', temp[2])
    _.set(result, 'TRANSACTION_TIMESTAMP', temp[3])
    _.set(result, 'TRANSACTION_DATE', temp[4])
    _.set(result, 'CAPTURED_DATE', stringDate(temp[4]))
    _.set(result, 'TYPE', temp[5])
    _.set(result, 'TRANSACTION_AMOUNT', Number(temp[6]))
    _.set(result, 'INSTALLMENTS', temp[7])
    _.set(result, 'GATEWAY_ID', temp[8])
    _.set(result, 'CC_BRAND', temp[9])
    _.set(result, 'CC_FIRST_LAST_FOUR', temp[10])
    _.set(result, 'AUTHORIZATION_CODE', temp[11])
    _.set(result, 'NSU', temp[12])
    _.set(result, 'GATEWAY_TRANSACTION_ID', temp[13])
    _.set(result, 'CURRENCY_CODE', temp[14])
    _.set(result, 'REFERENCE_NUMBER', temp[15])
    _.set(result, 'GATEWAY_CODE', temp[16])
    _.set(result, 'GATEWAY_MESSAGE', temp[17])
    _.set(result, 'STATE', temp[18])
    _.set(result, 'RECURRING_PAYMENT', temp[19])
    _.set(result, 'COMPANY_NAME', companyName)
    _.set(result, 'Championship', championship)
    _.set(result, 'Match', match)
    _.set(result, 'id_arquivo', params.fileId);

    return result;
}

const parser = (params) => {
    return new Promise((resolve, reject) => {
        let fullPath = _.get(params, 'fileInfo.FullPath', ''),
            fileId = _.get(params, 'fileInfo._id', ''),
            charset = _.get(params, 'charset', ''),
            encoding = 'utf8';

        if (_.toLower(charset.toString()).indexOf('utf') < 0) {
            encoding = 'binary';
        }

        fs.readFile(fullPath, encoding, function(err, contents) {
            if (err) {
                throw err;
            }

            let lines = contents.split('\n'),
                matches = [],
                parsed = [];
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i],
                    lineNumber = (i + 1),
                    args = { line, fileId, lineNumber, matches },
                    execute = true;

                if (_.isEmpty(_.trim(line)) == true) {
                    execute = false;
                }
                if (_.includes(line, 'MERCHANT_ID') == true) {
                    execute = false;
                }
                if (execute == true) {
                    parsed.push(parserRecord(args));
                }
            }

            params['parsed'] = parsed;
            params['matches'] = matches;

            return resolve(params);
        });
    })
}

const saveData = async (params) => {
    try {
        const parsed = params.parsed;

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  id = _.get(model, '_id', ''),
                  filter = { '_id': id };

            await mongodb.cldr_maxipago_daily.upsert(filter, model);
        }
    } catch (error) {
        throw error;
    }
    return params;
}

const sendMatch = async (params) => {
    try {
        const matches = params.matches,
              broker = params.broker;

        for (var i = 0; i < matches.length; i++) {
            var item = matches[i],
                championship = _.get(item, 'Championship', ''),
                match = _.get(item, 'Match', '');

            await publishSapB1(broker, 'Championship', 'Post', championship);
            await publishSapB1(broker, 'Match', 'Post', match);
        }
    } catch (error) {
        throw error;
    }
    return params;
}


export const parserFile = async (params) => {
    try {
        await getFileData(params);
        await charSetDetector(params);
        await parser(params);
        await saveData(params);
        await sendMatch(params);
    } catch (error) {
        params['Status'] = 'error';
        params['ErrorMessage'] = 'Error -> ' + err;
    } finally {
        await updateFileStatus(params)
    }

    return params;
}
