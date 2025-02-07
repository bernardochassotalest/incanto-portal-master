import _ from 'lodash'
import mongoose from 'mongoose'
import { stringDate } from 'app/lib/utils'
import schema from 'app/models/mongodb/skill/files/schema'

schema.statics.loadByFileId = async function(FileId) {
    return await this.findOne({FileId})
}

schema.statics.loadForExecute = async function(Priority) {
    let filter = {
            'Priority': Priority,
            'Status': 'pending'
        },
        sort = {
            'OriginalName': 1,
            'FileId':1
        };
    return await this.find(filter, sort)
}

const getFilter = (params) => {
    let from = _.get(params, 'from', ''),
        to = _.get(params, 'to', ''),
        status = _.get(params, 'status', 'all'),
        source = _.get(params, 'source', 'all'),
        result = {
            'ImportDate': { $gte: stringDate(from), $lte: stringDate(to) }
        };

    if (status != 'all') {
        result['Status'] = status;
    }
    if (source != 'all') {
        result['Source'] = source;
    }
    return result;
}

schema.statics.list = async function(params) {
    let { pagination } = params,
        { skip, limit } = pagination,
        filter = getFilter(params),
        fields = {
            'Status': 1,
            'Source': 1,
            'FileType': 1,
            'OriginalName': 1,
            'User': 1,
            'ErrorMessage': 1,
        },
        list = [],
        count = 0;

    try {
        list = await this.find(filter, fields)
                         .skip(skip)
                         .limit(limit),
        count = await this.countDocuments(filter)
    } catch (error) {
        throw error
    }

    return { list, 'pagination': { count, skip, limit } }
}

export default mongoose.model('cldr_files', schema, 'c_cldr_files')