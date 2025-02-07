import _ from 'lodash';
import debug from 'debug';
import { postgres } from 'app/models';
import { publishSapB1 } from 'app/lib/utils'
import accountingConfig from 'config/accounting';

const log = debug('incanto:skill:accounting:send');

export default {
    key: 'SkillAccountingSend',
    async handle({ data, broker }) {
        try {
          let refDate = _.get(data, 'refDate', '');
          if (_.isEmpty(refDate) == false) {
            await sendData(refDate, broker);
          }
        } catch (err) {
          log(`Error: ${err}`)
        }
    }
};

const sendData = async (refDate, broker) => {
  log(`Enviando lançamentos contábeis: ${refDate}`);

  let rows = await postgres.JournalVouchers.listPending({ refDate })

  for (let i = 0; i < rows.length; i++) {
    let item = rows[i],
        lines = _.get(item, 'items', []),
        project = {
          Code: _.get(item, 'projectId', ''),
          Name: _.get(item, 'projectData.prjName', '')
        },
        championship = {
          Code: _.get(item, 'championshipId', ''),
          Name: _.get(item, 'championshipData.name', '')
        },
        match = {
          Code: _.get(item, 'matchId', ''),
          Name: _.get(item, 'matchData.name', '')
        },
        model = {
          RefDate: _.get(item, 'refDate', ''),
          TaxDate: _.get(item, 'taxDate', ''),
          DueDate: _.get(item, 'dueDate', ''),
          Ref1: '',
          Ref2: '',
          Ref3: '',
          Memo: _.get(item, 'memo', ''),
          Tag: _.get(item, 'tag', ''),
          PointOfSale: _.get(item, 'pointOfSale', ''),
          WebId: _.get(item, 'id', ''),
          Lines: []
        };

    log(`Processando: ${item.id} - ${item.refDate}`);
    if (_.isEmpty(project.Code) == false) {
      model['Project'] = project;
    }
    if (_.isEmpty(championship.Code) == false) {
      model['Championship'] = championship;
    }
    if (_.isEmpty(match.Code) == false) {
      model['Match'] = match;
    }
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i],
        shortName = {
          Code: _.get(line, 'shortName', ''),
          Name: _.get(line, 'businessPartner.cardName', '')
        },
        costingCenter = {
          Code: _.get(line, 'costingCenter', ''),
          Name: _.get(line, 'costingCenterData.ocrName', '')
        },
        project = {
          Code: _.get(line, 'project', ''),
          Name: _.get(line, 'projectData.prjName', '')
        },
        data = {
          Account : {
              Code : _.get(line, 'account', ''),
              Name : _.get(line, 'accountData.acctName', '')
          },
          Debit : _.get(line, 'debit', 0),
          Credit : _.get(line, 'credit', 0),
          LineMemo : _.get(line, 'memo', '')
        };

      if (_.isEmpty(shortName.Code) == false) {
        data['ShortName'] = shortName;
      }
      if (_.isEmpty(costingCenter.Code) == false) {
        data['CostingCenter'] = costingCenter;
      }
      if (_.isEmpty(project.Code) == false) {
        data['Project'] = project;
      }
      model.Lines.push(data)
    }

    if (i >= rows.length - 1) {
      model['Url'] = accountingConfig.url;
    }
    publishSapB1(broker, 'JournalVoucher', 'Post', model);

    item.status = 'confirmed'
    await item.save()
  }
}
