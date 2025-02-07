import _ from 'lodash'
import libAsync from 'async';
import { loadPontoVenda } from 'app/jobs/skill/commons/utils'
import { parser, validate, saveData } from 'app/jobs/skill/finance-files/rede/eesa/parser'
import { saveBatches } from 'app/jobs/skill/finance-files/rede/eesa/batches'

export const eesaParser = async (params) => {
    try {
        await loadPontoVenda(params);
        await parser(params);
        await validate(params);
        await saveData(params);
        await saveBatches(params);
    } catch (error) {
        throw error;
    }
}
