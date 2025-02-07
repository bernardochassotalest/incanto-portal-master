import _ from 'lodash'
import mongoose from 'mongoose'
import schema from 'app/models/mongodb/bradesco/extrato/record3/schema'

schema.pre('save', function(next) {
	this.ponto_venda = _.padStart(this.ponto_venda, 12, '0');

	return next();
})

export default mongoose.model('cldr_bradesco_extrato_record3', schema, 'c_cldr_bradesco_extrato')
