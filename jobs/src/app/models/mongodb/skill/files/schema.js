import {Schema} from 'mongoose'

const schema = new Schema({
	'ProcessDate': Date,
	'ImportDate': String,
	'OriginalName': String,
	'Priority': String,
	'FileId': String,
	'FileName': String,
	'FullPath': String,
	'Source': String,
	'FileType': String,
	'Status': {
		'type': String,
		'enum': [
			'pending',
			'executing',
			'success',
			'error',
			'canceled'
		]
	},
	'ErrorMessage': String
})

schema.set('timestamps', true)
schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

schema.index({ 'ImportDate': 1, 'Status': 1 })
schema.index({ 'Priority': 1, 'Status': 1 })

export default schema