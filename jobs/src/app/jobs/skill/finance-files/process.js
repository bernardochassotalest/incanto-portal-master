import _ from 'lodash';
import debug from 'debug';
import Queue from 'app/lib/queue';
import libAsync from 'async';
import fileConfig from 'config/files';
import { mongodb } from 'app/models';
import { parserFile as parserCielo } from './cielo'
import { parserFile as parserItau } from './itau'
import { parserFile as parserBradesco } from './bradesco'
import { parserFile as parserMaxipago } from './maxipago'
import { parserFile as parserRede } from './rede'

const log = debug('incanto:skill:finances:process');

export default {
    key: 'SkillFinanceFilesProcess',
    async handle({ data, broker }) {
        let params = { data, broker };
        runExecute(params);
    }
};
const runExecute = async (params) => {
    try {
        let { broker } = params;
        const priorities = [
            { 'code': '21001', 'name': 'Maxipago - Transações', 'source': 'maxipago' },
            { 'code': '31001', 'name': 'Rede - EEVC', 'source': 'rede' },
            { 'code': '31002', 'name': 'Rede - EEVD', 'source': 'rede' },
            { 'code': '31003', 'name': 'Rede - EEFI', 'source': 'rede' },
            { 'code': '31004', 'name': 'Rede - EESA', 'source': 'rede' },
            { 'code': '32001', 'name': 'Cielo - Vendas', 'source': 'cielo' },
            { 'code': '32002', 'name': 'Cielo - Pagamentos', 'source': 'cielo' },
            { 'code': '32003', 'name': 'Cielo - Antecipação', 'source': 'cielo' },
            { 'code': '32004', 'name': 'Cielo - Saldos', 'source': 'cielo' },
            { 'code': '41001', 'name': 'Itau - Extrato', 'source': 'itau' },
            { 'code': '41002', 'name': 'Itau - Boletos', 'source': 'itau' },
            { 'code': '41003', 'name': 'Itau - Débito Automático', 'source': 'itau' },
            { 'code': '42001', 'name': 'Bradesco - Extrato', 'source': 'bradesco' },
            { 'code': '42002', 'name': 'Bradesco - Boletos', 'source': 'bradesco' },
        ];
        const executing = _.get(process, 'files_executing', false);
        
        if (!executing) {
            process.files_executing = true;
            
            for (var i = 0; i < priorities.length; i++) {
                let item = priorities[i],
                files = await mongodb.cldr_files.loadForExecute(item.code),
                source = _.get(item, 'source', '');
                
                for (var j = 0; j < files.length; j++) {
                    let file = files[j],
                        raw = file.toObject(),
                        params = { broker, ...raw };

                    if (source == 'maxipago') {
                        await parserMaxipago(params)
                    } else if (source == 'rede') {
                        await parserRede(params)
                    } else if (source == 'cielo') {
                        await parserCielo(params)
                    } else if (source == 'itau') {
                        await parserItau(params)
                    } else if (source == 'bradesco') {
                        await parserBradesco(params)
                    }
                }
            }

            process.files_executing = false;
        }
    } catch (err) {
        log(`Error: ${err}`); sendError(err);
    }
}

const sendError = (error) => {
    let options = {
        name: 'Incanto - Finance - Files',
        email: fileConfig.mailAlert,
        subject: '[INCANTO] Erro no processamento de arquivos financeiros',
        contents: `Mensagem do erro [${error}]`
    }
    Queue.add('SendEmail', options);
}
