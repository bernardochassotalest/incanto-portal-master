import { Model, DataTypes } from 'sequelize';

class JournalVouchers extends Model {
	static init(sequelize) {
		super.init({
			id: { type: DataTypes.STRING, primaryKey: true },
			status: DataTypes.STRING,
			group: DataTypes.STRING,
			refDate: DataTypes.STRING,
			taxDate: DataTypes.STRING,
			dueDate: DataTypes.STRING,
			locTotal: DataTypes.DECIMAL(13, 2),
			tag: DataTypes.STRING,
			memo: DataTypes.STRING,
			ref3: DataTypes.STRING,
			projectId: DataTypes.STRING,
			pointOfSale: DataTypes.STRING,
			championshipId: DataTypes.STRING,
			matchId: DataTypes.STRING,
			transId: DataTypes.STRING,
			logMessage: DataTypes.STRING,
		},
		{
			sequelize, modelName: 'journalVouchers'
		});
	}
}

export default JournalVouchers;
