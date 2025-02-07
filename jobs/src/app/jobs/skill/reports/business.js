import _ from 'lodash';
import { postgres } from 'app/models';
import { mapData } from 'app/jobs/skill/reports/helper'

export const getSheetHistorico = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.Sales.getReportHistorico(tags, from, to);

  return mapData(worksheet, 'historicoFatura', data, logInfo, accounting);
}

export const getSheetSaldos = async (worksheet, tags, from, to, logInfo) => {
  let data = await postgres.Sales.getReportSaldos(tags, from, to);

  return mapData(worksheet, 'saldosFatura', data, logInfo, [], false);
}

export const getSheetSaldosAbertosCartoes = async (worksheet, tags, from, to, logInfo) => {
  let data = await postgres.Sales.getReportSaldosAbertos(tags, from, to, 'creditCard');

  return mapData(worksheet, 'saldosCartoes', data, logInfo, [], false);
}

export const getSheetSaldosAbertosBoletos = async (worksheet, tags, from, to, logInfo) => {
  let data = await postgres.Sales.getReportSaldosAbertos(tags, from, to, 'slip');

  return mapData(worksheet, 'saldosBoletos', data, logInfo, [], false);
}

export const getSheetSaldosAbertosDebito = async (worksheet, tags, from, to, logInfo) => {
  let data = await postgres.Sales.getReportSaldosAbertos(tags, from, to, 'directDebit');

  return mapData(worksheet, 'saldosDebito', data, logInfo, [], false);
}

export const getSheetSaldosAbertosNaoCaptura = async (worksheet, tags, from, to, logInfo) => {
  let data = await postgres.Sales.getReportSaldosAbertos(tags, from, to, 'notCaptured');

  return mapData(worksheet, 'saldosNaoCaptura', data, logInfo, [], false);
}

export const getSheetSaldosAbertosPECLD = async (worksheet, tags, from, to, logInfo) => {
  let data = await postgres.Sales.getReportSaldosAbertos(tags, from, to, 'pecld');

  return mapData(worksheet, 'saldosPECLD', data, logInfo, [], false);
}

export const getSheetReceitas = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportReceitas(tags, from, to);

  return mapData(worksheet, 'receitas', data, logInfo, accounting);
}

export const getSheetCartoesCaptura = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportCartoesCaptura(tags, from, to);

  return mapData(worksheet, 'cartoesCaptura', data, logInfo, accounting);
}

export const getSheetBoletos = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportBoletos(tags, from, to);

  return mapData(worksheet, 'boletos', data, logInfo, accounting);
}

export const getSheetNaoCapturado = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportNaoCapturado(tags, from, to);

  return mapData(worksheet, 'naoCapturado', data, logInfo, accounting);
}

export const getSheetCancelamentos = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportCancelamentos(tags, from, to);

  return mapData(worksheet, 'naoCapturado', data, logInfo, accounting);
}

export const getSheetPECLD = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportPECLD(tags, from, to);

  return mapData(worksheet, 'naoCapturado', data, logInfo, accounting);
}

export const getSheetCreditos = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportCreditos(tags, from, to);

  return mapData(worksheet, 'creditos', data, logInfo, accounting);
}

export const getSheetDuplicidade = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportDuplicidade(tags, from, to);

  return mapData(worksheet, 'duplicidade', data, logInfo, accounting);
}

export const getSheetCartoesLiquidacao = async (worksheet, tags, from, to, logInfo) => {
  let { data, accounting } = await postgres.JournalVouchers.getReportCartoesLiquidacao(tags, from, to);

  return mapData(worksheet, 'cartoesLiquidacao', data, logInfo, accounting);
}

export const getSheetConcBoletos = async (worksheet, tags, from, to, logInfo, isManual) => {
  let data = await postgres.ConciliationItems.getReportBoletos(tags, from, to, isManual);

  return mapData(worksheet, 'concBoletos', data, logInfo, [], false);
}

export const getSheetConcCartaoCaptura = async (worksheet, tags, from, to, logInfo, isManual) => {
  let data = await postgres.ConciliationItems.getReportCartaoCaptura(tags, from, to, isManual);

  return mapData(worksheet, 'concCartaoCaptura', data, logInfo, [], false);
}

export const getSheetConcCartaoLiquidacao = async (worksheet, tags, from, to, logInfo, isManual) => {
  let data = await postgres.ConciliationItems.getReportCartaoLiquidacao(tags, from, to, isManual);

  return mapData(worksheet, 'concCartaoLiquidacao', data, logInfo, [], false);
}

export const getSheetConcExtratoBancario = async (worksheet, tags, from, to, logInfo, isManual) => {
  let data = await postgres.ConciliationItems.getReportExtratoBancario(tags, from, to, isManual);

  return mapData(worksheet, 'concExtratoBancario', data, logInfo, [], false);
}

export const getSheetConcVindi = async (worksheet, tags, from, to, logInfo, isManual) => {
  let data = await postgres.ConciliationItems.getReportVindi(tags, from, to, isManual);

  return mapData(worksheet, 'concConcVindi', data, logInfo, [], false);
}

export const getSheetConcMulticlubes = async (worksheet, tags, from, to, logInfo, isManual) => {
  let data = await postgres.ConciliationItems.getReportMulticlubes(tags, from, to, isManual);

  return mapData(worksheet, 'concConcMulticlubes', data, logInfo, [], false);
}

export const getSheetCreditosClientes = async (worksheet, tags, from, to, logInfo) => {
  let data = await postgres.CustomerCredits.getReportSaldos(tags, from, to);

  return mapData(worksheet, 'creditosClientes', data, logInfo, [], false);
}
