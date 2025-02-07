const parseRecordD = require('./parserRecordD');
const parseRecordE = require('./parserRecordE');
const { createLogger } = require('../../../utils/logger');

const logger = createLogger('cielo-parser-v15.9');

class CieloParser {
  constructor() {
    this.records = {
      D: [],
      E: []
    };
  }

  parseLine(line) {
    try {
      const recordType = line.charAt(0);

      switch (recordType) {
        case 'D':
          this.records.D.push(parseRecordD(line));
          break;
        case 'E':
          this.records.E.push(parseRecordE(line));
          break;
        default:
          logger.warn(`Tipo de registro não suportado: ${recordType}`);
      }
    } catch (error) {
      logger.error('Erro ao processar linha:', error);
      throw error;
    }
  }

  async saveData(db) {
    try {
      const session = await db.startSession();
      
      await session.withTransaction(async () => {
        // Salva registros D
        if (this.records.D.length > 0) {
          await db.collection('cielo_transacoes').insertMany(
            this.records.D,
            { session }
          );
        }

        // Salva registros E
        if (this.records.E.length > 0) {
          await db.collection('cielo_pagamentos').insertMany(
            this.records.E,
            { session }
          );
        }
      });

      await session.endSession();
      
      logger.info(`Processamento concluído: ${this.records.D.length} transações e ${this.records.E.length} pagamentos`);
    } catch (error) {
      logger.error('Erro ao salvar dados:', error);
      throw error;
    }
  }

  getStats() {
    return {
      totalTransacoes: this.records.D.length,
      totalPagamentos: this.records.E.length
    };
  }
}

module.exports = CieloParser;
