import _ from 'lodash'

export const enhanceBill = async (data) => {
    let created_at = _.get(data, 'created_at', '').substr(0, 10),
        result = {
            'dates': {
                'issued': created_at,
                'due': '',
                'paid': '',
                'canceled': ''
            },
            'items_amount': 0
        },
        status = _.get(data, 'status', ''),
        bill_items = _.get(data, 'bill_items', []),
        charges = _.get(data, 'charges', []),
        updated = _.get(data, 'updated_at', ''),
        due_at = '', paid_at = '';

    data['amount'] = _.toNumber(data['amount']);
    for (var i = 0; i < bill_items.length; i++) {
        let item = bill_items[i];
        item['amount'] = _.toNumber(item['amount']);
        _.set(item, 'pricing_schema.price', _.toNumber(_.get(item, 'pricing_schema.price', 0)));
        result['items_amount'] += item.amount;
    }

    for (var i = 0; i < charges.length; i++) {
        let item = charges[i],
            lastTransaction = _.get(item, 'last_transaction', ''),
            statusTransaction = _.toString(_.get(lastTransaction, 'status', '')),
            localDue = _.get(item, 'due_at', ''),
            localPaid = _.get(item, 'paid_at', '');
        if (_.isEmpty(localDue) == false) {
            due_at = localDue.substr(0, 10);
        }
        if (_.isEmpty(localPaid) == false) {
            paid_at = localPaid.substr(0, 10);
        }
        item['amount'] = _.toNumber(item['amount']);
        if (_.isEmpty(lastTransaction) == false) {
            lastTransaction['amount'] = _.toNumber(lastTransaction['amount']);
        }
    }
    if (_.isEmpty(due_at) == false) {
        _.set(result, 'dates.due', due_at);
    } else {
        _.set(result, 'dates.due', created_at);
    }
    if (_.isEmpty(paid_at) == false) {
        _.set(result, 'dates.paid', paid_at);
    }
    if (status == 'canceled') {
        _.set(result, 'dates.canceled', updated.substr(0, 10));
    }

    return result;
}

export const enhanceTransaction = (data) => {
    let created_at = _.get(data, 'created_at', ''),
        updated_at = _.get(data, 'updated_at', ''),
        result = {
            'dates': {
                'created': created_at,
                'updated': updated_at
            }
        };
    data['amount'] = _.toNumber(data['amount']);
    return result;
}

export const enhanceIssue = (data) => {
    let created_at = _.get(data, 'created_at', ''),
        updated_at = _.get(data, 'updated_at', ''),
        result = {
            'dates': {
                'created': created_at,
                'updated': updated_at
            }
        },
        amounts = data.data;

    amounts['expected_amount'] = _.toNumber(amounts['expected_amount']);
    amounts['transaction_amount'] = _.toNumber(amounts['transaction_amount']);

    return result;
}
