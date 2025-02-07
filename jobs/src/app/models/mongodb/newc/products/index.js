import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/newc/products/schema'

schema.statics.listForLink = async function(ids) {
    let pipeline = [],
        filter = {
            'ProductId': { $in: ids }
        },
        project = {
            '_id': 0,
            'ProductId': 1,
            'ProductType': 1,
            'Name': 1,
            'Tournament': 1,
            'FederationReportPriceTreshold': 1,
            'StadiumName': 1,
            'StartDate': 1,
        },
        result = [];

    pipeline.push({ $match: filter });
    pipeline.push({ $project: project });

    try {
        result = await this.aggregate(pipeline);
    } catch (error) {
        throw error
    }

    return result
}

export default mongoose.model('sales_newc_products', schema, 'c_sales_newc_products')