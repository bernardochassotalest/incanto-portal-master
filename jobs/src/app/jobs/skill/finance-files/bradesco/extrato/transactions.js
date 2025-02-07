import _ from 'lodash'
import { md5 } from 'app/lib/utils'

const statementParser = (model) => {
    let result = {},
        modelId = _.get(model, '_id', ''),
        bank = _.get(model, 'banco', ''),
        id = md5(`${bank}-${modelId}`),
        type = _.get(model, 'tipo_lancamento', ''),
        debit = (type === 'D' ? _.get(model, 'valor_lancamento', 0) : 0),
        credit = (type === 'C' ? _.get(model, 'valor_lancamento', 0) : 0),
        categoryCode = _.get(model, 'categoria_lancamento.code', ''),
        categoryName = _.get(model, 'categoria_lancamento.name', ''),
        historico = _.get(model, 'desc_historico', ''),
        complemento = _.get(model, 'segunda_linha', '');

    _.set(result, 'id', id);
    _.set(result, 'bank', bank);
    _.set(result, 'branch', _.get(model, 'agencia', ''));
    _.set(result, 'account', _.get(model, 'conta_corrente', ''));
    _.set(result, 'digitAccount', _.get(model, 'dig_conta_corrente', ''));
    _.set(result, 'date', _.get(model, 'data_lancamento', ''));
    _.set(result, 'debit', debit);
    _.set(result, 'credit', credit);
    _.set(result, 'balance', _.get(model, 'valor_saldo', 0));
    _.set(result, 'category',  `${categoryCode}-${categoryName}`);
    _.set(result, 'cashFlow', '');
    _.set(result, 'notes', _.trim(`${historico} ${complemento}`));
    _.set(result, 'acquirer', _.get(model, 'adquirente.code', ''));
    _.set(result, 'pointOfSale', _.get(model, 'ponto_venda', ''));
    _.set(result, 'conciliationType', _.get(model, '_conciliationType', ''));
    _.set(result, 'keyCommon', _.get(model, '_keyCommon', ''));
    _.set(result, 'sourceDb', 'c_cldr_bradesco_extrato');
    _.set(result, 'sourceId', modelId);
    _.set(result, 'fileName', _.get(model, 'fileName', ''));
    _.set(result, 'fileLine', _.get(model, 'nro_linha', 0));

    return result;
}

export const saveTransaction = async (params) => {
    try {
        const { parsed, fileName, broker } = params;
        let generated = [];

        for (var i = 0; i < parsed.length; i++) {
            const model = parsed[i],
                  registro = _.get(model, 'registro', ''),
                  keyCommon = _.get(model, '_keyCommon', '');

            model['fileName'] = fileName;

            if ((registro == '3') && (_.isEmpty(keyCommon) == false)) {
                let statement = statementParser(model)
                await broker.publish('incanto.Skill.BankStatement.Post', statement);
                generated.push(statement);
            }
        }

        params['transactions'] = generated;
    } catch (error) {
        throw error;
    }

    return params;
}
