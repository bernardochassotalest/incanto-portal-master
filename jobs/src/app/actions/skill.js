import _ from 'lodash';
import fs from 'fs'
import path from 'path'
import debug from 'debug';
import moment from 'moment'
import Queue from 'app/lib/queue';
import { mongodb, postgres } from 'app/models';
import { md5, getParams, getFilesizeInBytes, moveFile, removeFile, createFolder } from 'app/lib/utils'
import fileConfig from 'config/files';

const log = debug('incanto:skill:files');

export default {
    uploadFiles: async (request, response) => {
        try {
            let params = getParams(request);

            let result = await runImport(params);

            response.json({error: false, message: result})
        } catch(err) {
            log(`Error: ${err}`);
            response.json({ error: true,  message : err })
        }
    },
    reports: async (request, response) => {
      try {
          Queue.add('SkillReportsProcess', getParams(request));

          response.json({error: false, message: 'Report Scheduled.'})
      } catch(err) {
          log(`Error: ${err}`);
          response.json({ error: true,  message : err })
      }
    },
    accounting: async (request, response) => {
        try {
          let PIPE_FOLDER = process.env.DIR_ATTACHMENT,
            filePipe = `${PIPE_FOLDER}/running_accounting.pipe`,
            result = {error: false, message: 'Pooling started.'};

          await createFolder(PIPE_FOLDER);

          if (fs.existsSync(filePipe)) {
            log('Already executing');
            result = {error: true, message: 'Already executing.'}
          } else {
            Queue.add('SkillAccountingGenerate', {});
          }

          response.json(result)
        } catch(err) {
          log(`Error: ${err}`);
          response.json({ error: true,  message : err })
        }
    }
}

const runImport = async (data) => {
    const SERVER_FILES = path.join(fileConfig.folders.server, 'uploads');
    let { files } = data,
        result = { 'message': 'Files processed.', 'success': [], 'unknown': [] };

    await createFolder(SERVER_FILES);

    if (!_.isEmpty(files)) {
        for (var i = 0; i < files.length; i++) {
            const item = files[i],
                  fullPath = _.get(item, 'path', ''),
                  fileName = _.get(item, 'filename', ''),
                  fullName = path.join(SERVER_FILES, fileName),
                  fileId = md5(fileName),
                  { Source, FileType, Priority } = checkSource(fullPath);

            log(`Processing: ${fileName}`)
            if (FileType != 'not-found') {
                let model = {
                        'ImportDate': moment().tz('America/Sao_Paulo').format('YYYY-MM-DD'),
                        'OriginalName': _.get(item, 'originalname', ''),
                        'Priority': Priority,
                        'FullPath': fullName,
                        'FileId': fileId,
                        'FileName': fileName,
                        'Source': Source,
                        'FileType': FileType,
                        'Status': 'pending',
                        'ErrorMessage': ''
                    };

                if (getFilesizeInBytes(fullPath) <= 0) {
                    model['Status'] = 'error';
                    model['ErrorMessage'] = 'Arquivo sem conteúdo.';
                    model['ProcessDate'] = new Date();
                }

                await moveFile(fullPath, fullName)
                var instance = new mongodb.cldr_files(model)
                await instance.save()

                if ((model.Source == 'itau') && (_.includes(['boleto', 'debito-240'], model.FileType) == true)) {
                  const batchFolder = path.join(fileConfig.folders.server, fileConfig.van, 'processed'),
                    batchData = {
                      id: md5(model.OriginalName),
                      status: 'created',
                      source: model.Source,
                      type: model.FileType,
                      fileName: model.OriginalName,
                      filePath: batchFolder,
                      payMethodCode: '',
                      payCompanyCode: '',
                      batchId: '',
                      batchStatus: '',
                      batchResult: '{}',
                    };
                  await postgres.VindiImportBatches.upsert(batchData);
                }

                result.success.push(fileName)
            } else {
                result.unknown.push(fileName)
                await removeFile(fullPath)
            }
        }
    }
}

const checkSource = (filename) => {
    const expressaoCielo = new RegExp(/cielo/ig),
          expressaoRede = new RegExp(/eevc|eevd|eefi|eesa|redecard/ig),
          expressaoItau = new RegExp(/banco itau|cobranca|retorno|debito|automatico|0440|0550/ig),
          expressaoBradesco = new RegExp(/bradesco|cobranca|retorno|0440050|0550/ig),
          expressaoMaxipago = new RegExp(/MERCHANT_ID|TRANSACTION_ID|CC_FIRST_LAST_FOUR|GATEWAY_CODE/ig);

    let result = {
            'Source': 'not-found',
            'FileType': 'not-found'
        },
        contents = fs.readFileSync(filename, 'utf8'),
        matchCielo = _.uniq(contents.match(expressaoCielo)),
        matchRede = _.uniq(contents.match(expressaoRede)),
        matchItau = _.uniq(contents.match(expressaoItau)),
        matchBradesco = _.uniq(contents.match(expressaoBradesco)),
        matchMaxipago = _.uniq(contents.match(expressaoMaxipago));

    // --> Priority (First  Digit) - [1-Sales/2-Gateway/3-Acquirer/4-Bank] <--//
    // --> Priority (Second Digit) - [1-Maxipago/1-Rede/2-Cielo/1-Itau/2-Bradesco] <--//
    if (matchBradesco) {
        if ((matchBradesco.length >= 2) && (_.includes(matchBradesco, 'BRADESCO') === true)) {
            var idHeader = contents.substr(163, 3),
                idBatch = contents.substr(251, 7);
            result['Source'] = 'bradesco';
            if ((idHeader === '050') && (idBatch === '0440050')) {
                result['FileType'] = 'extrato';
                result['Priority'] = '42001';
            } else if ((_.includes(matchBradesco, 'RETORNO') === true) && (_.includes(matchBradesco, 'COBRANCA') === true)) {
                result['FileType'] = 'boleto';
                result['Priority'] = '42002';
            }
        }
    }
    if (matchItau) {
        if ((matchItau.length >= 2) && (_.includes(matchItau, 'BANCO ITAU') === true)) {
            var idHeader = contents.substr(163, 3),
                idBatch = contents.substr(251, 4);
            result['Source'] = 'itau';
            if ((idHeader === '050') && (idBatch === '0440')) {
                result['FileType'] = 'extrato';
                result['Priority'] = '41001';
            } else if ((idHeader === '040') && (idBatch === '0550')) {
                result['FileType'] = 'debito-240';
                result['Priority'] = '41003';
            } else if ((_.includes(matchItau, 'DEBITO') === true) && (_.includes(matchItau, 'AUTOMATICO') === true)) {
                result['FileType'] = 'debito-150';
                result['Priority'] = '41003';
            } else if ((_.includes(matchItau, 'RETORNO') === true) && (_.includes(matchItau, 'COBRANCA') === true)) {
                result['FileType'] = 'boleto';
                result['Priority'] = '41002';
            }
        }
    }
    if (matchRede) {
        if (matchRede.length >= 2) {
            var adquirente = _.toLower(matchRede[0]),
                tipo_arquivo = _.toLower(matchRede[1]);

            if (adquirente == 'redecard') {
                result['Source'] = 'rede';
                result['FileType'] = tipo_arquivo;
                if (tipo_arquivo == 'eevc') {
                    result['Priority'] = '31001';
                } else if (tipo_arquivo == 'eevd') {
                    result['Priority'] = '31002';
                } else if (tipo_arquivo == 'eefi') {
                    result['Priority'] = '31003';
                } else if (tipo_arquivo == 'eesa') {
                    result['Priority'] = '31004';
                }
            }
        }
    }
    if (matchCielo) {
        if (matchCielo.length > 0) {
            var idTipo = contents.substr(47, 2);

            if (result.FileType === 'not-found') {
                result['Source'] = 'cielo';
                if (idTipo == '03') {
                    result['FileType'] = 'vendas';
                    result['Priority'] = '32001';
                } else if (idTipo == '04') {
                    result['FileType'] = 'pagamentos';
                    result['Priority'] = '32002';
                } else if (idTipo == '06') {
                    result['FileType'] = 'antecipacao';
                    result['Priority'] = '32003';
                } else if (idTipo == '09') {
                    result['FileType'] = 'saldos';
                    result['Priority'] = '32004';
                }
            }
        }
    }
    if (matchMaxipago) {
        if (matchMaxipago.length >= 4) {
            result['Source'] = 'maxipago';
            result['FileType'] = 'transacoes';
            result['Priority'] = '21001';
        }
    }

    return result;
}
