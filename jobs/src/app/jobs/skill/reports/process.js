import _ from 'lodash';
import debug from 'debug';
import Excel from 'exceljs';
import { postgres } from 'app/models';
import { getTimeLog, createFolder } from 'app/lib/utils';
import { getSheetHistorico, getSheetSaldos, getSheetReceitas, getSheetCartoesCaptura, getSheetBoletos,
         getSheetNaoCapturado, getSheetCancelamentos, getSheetPECLD, getSheetCreditos, getSheetDuplicidade,
         getSheetCartoesLiquidacao, getSheetConcBoletos, getSheetConcCartaoCaptura, getSheetConcCartaoLiquidacao,
         getSheetConcExtratoBancario, getSheetConcVindi, getSheetConcMulticlubes, getSheetCreditosClientes,
         getSheetSaldosAbertosCartoes, getSheetSaldosAbertosBoletos, getSheetSaldosAbertosDebito,
         getSheetSaldosAbertosNaoCaptura, getSheetSaldosAbertosPECLD } from 'app/jobs/skill/reports/business';

const log = debug('incanto:skill:reports:process');

export default {
    key: 'SkillReportsProcess',
    async handle({ data, broker }) {
        let params = { data, broker };
        runExecute(params);
    }
};

const runExecute = async (params) => {
  try {
    let ATTACHMENT_FOLDER = process.env.DIR_ATTACHMENT,
      REPORT_FOLDER = `${ATTACHMENT_FOLDER}/reports`,
      id = _.get(params, 'data.id', ''),
      found = await postgres.ReportRequests.listById(id);

    await createFolder(REPORT_FOLDER);

    if (found) {
      let typeId = _.get(found, 'typeId', ''),
        filters = _.get(found, 'filters', ''),
        tags = _.get(found, 'userData.profile.tags', ''),
        logInfo = _.get(found, 'log', ''),
        timeLog = getTimeLog(),
        fileName = `${REPORT_FOLDER}/${typeId}-${timeLog}.xlsx`,
        result = false;

      log(`Gerando o relatório: ${id}`);

      await postgres.ReportRequests.update({status: 'executing', timeLog, fileName}, { where: { id }});

      if (typeId == 'detalhes-lcm') {
        result = await detalhesLcm({...filters, tags, logInfo, fileName});
      } else if (typeId == 'historico-faturas') {
        result = await historicoFaturas({...filters, tags, logInfo, fileName});
      } else if (typeId == 'saldo-faturas') {
        result = await saldoFaturas({...filters, tags, logInfo, fileName});
      } else if (typeId == 'saldos-abertos') {
        result = await saldoEmAbertoDeFaturas({...filters, tags, logInfo, fileName});
      } else if ((typeId == 'nao-conciliadas') || (typeId == 'conciliado-manual')) {
        result = await naoConciliadas({...filters, tags, logInfo, fileName, typeId});
      } else if (typeId == 'creditos-clientes') {
        result = await creditosClientes({...filters, tags, logInfo, fileName});
      }

      if (result === true) {
        await postgres.ReportRequests.update({status: 'available'}, { where: { id }});
      }
    } else {
      log(`Relatório não encontrado ou já executado: ${id}`);
    }
  } catch (err) {
    log(`Error: ${err}`);
  }
}

const wsHeader = { views: [ { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2', activeCell: 'A2' } ] };

const detalhesLcm = async ({tags, startDate, endDate, logInfo, fileName}) => {
  let result = false;

  try {
    const options = { filename: fileName, useStyles: true, useSharedStrings: true },
      workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    workbook.creator = logInfo;
    await getSheetReceitas(workbook.addWorksheet('receitas', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetCartoesCaptura(workbook.addWorksheet('cartao-captura', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetBoletos(workbook.addWorksheet('boletos', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetNaoCapturado(workbook.addWorksheet('nao-capturado', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetCancelamentos(workbook.addWorksheet('cancelamentos', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetPECLD(workbook.addWorksheet('pecld', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetCreditos(workbook.addWorksheet('creditos', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetDuplicidade(workbook.addWorksheet('duplicidade', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetCartoesLiquidacao(workbook.addWorksheet('cartao-liquidacao', wsHeader), tags, startDate, endDate, logInfo);

    await workbook.commit();

    result = true;
  } catch (err) {
    log(`Error: ${err}`);
  }

  return result;
}

const historicoFaturas = async ({tags, startDate, endDate, logInfo, fileName}) => {
  let result = false;

  try {
    const options = { filename: fileName, useStyles: true, useSharedStrings: true },
      workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    workbook.creator = logInfo;
    await getSheetHistorico(workbook.addWorksheet('historico-faturas', wsHeader), tags, startDate, endDate, logInfo);

    await workbook.commit();

    result = true;
  } catch (err) {
    log(`Error: ${err}`);
  }

  return result;
}

const saldoFaturas = async ({tags, startDate, endDate, logInfo, fileName}) => {
  let result = false;

  try {
    const options = { filename: fileName, useStyles: true, useSharedStrings: true },
      workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    workbook.creator = logInfo;
    await getSheetSaldos(workbook.addWorksheet('saldos-faturas', wsHeader), tags, startDate, endDate, logInfo);

    await workbook.commit();

    result = true;
  } catch (err) {
    log(`Error: ${err}`);
  }

  return result;
}

const saldoEmAbertoDeFaturas = async ({tags, startDate, endDate, logInfo, fileName}) => {
  let result = false;

  try {
    const options = { filename: fileName, useStyles: true, useSharedStrings: true },
      workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    workbook.creator = logInfo;
    await getSheetSaldosAbertosCartoes(workbook.addWorksheet('saldos-cartoes', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetSaldosAbertosBoletos(workbook.addWorksheet('saldos-boletos', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetSaldosAbertosDebito(workbook.addWorksheet('saldos-debito', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetSaldosAbertosNaoCaptura(workbook.addWorksheet('saldos-nao-captura', wsHeader), tags, startDate, endDate, logInfo);
    await getSheetSaldosAbertosPECLD(workbook.addWorksheet('saldos-pecld', wsHeader), tags, startDate, endDate, logInfo);

    await workbook.commit();

    result = true;
  } catch (err) {
    log(`Error: ${err}`);
  }

  return result;
}

const naoConciliadas = async ({tags, startDate, endDate, logInfo, fileName, typeId}) => {
  let result = false;

  try {
    const options = { filename: fileName, useStyles: true, useSharedStrings: true },
      workbook = new Excel.stream.xlsx.WorkbookWriter(options),
      isManual = (typeId == 'conciliado-manual' ? true : false);

    workbook.creator = logInfo;
    await getSheetConcBoletos(workbook.addWorksheet('boletos', wsHeader), tags, startDate, endDate, logInfo, isManual);
    await getSheetConcCartaoCaptura(workbook.addWorksheet('cartao-captura', wsHeader), tags, startDate, endDate, logInfo, isManual);
    await getSheetConcCartaoLiquidacao(workbook.addWorksheet('cartao-liquidacao', wsHeader), tags, startDate, endDate, logInfo, isManual);
    await getSheetConcExtratoBancario(workbook.addWorksheet('extrato-bancario', wsHeader), tags, startDate, endDate, logInfo, isManual);
    await getSheetConcVindi(workbook.addWorksheet('vindi', wsHeader), tags, startDate, endDate, logInfo, isManual);
    await getSheetConcMulticlubes(workbook.addWorksheet('multiclubes', wsHeader), tags, startDate, endDate, logInfo, isManual);

    await workbook.commit();

    result = true;
  } catch (err) {
    log(`Error: ${err}`);
  }

  return result;
}

const creditosClientes = async ({tags, startDate, endDate, logInfo, fileName}) => {
  let result = false;

  try {
    const options = { filename: fileName, useStyles: true, useSharedStrings: true },
      workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    workbook.creator = logInfo;
    await getSheetCreditosClientes(workbook.addWorksheet('creditos-clientes', wsHeader), tags, startDate, endDate, logInfo);

    await workbook.commit();

    result = true;
  } catch (err) {
    log(`Error: ${err}`);
  }

  return result;
}
