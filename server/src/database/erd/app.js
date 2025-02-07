import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import SequelizeErd from 'sequelize-erd';
import postgresConfig from 'libs/framework/connectors/postgres-config';
import { dynamicLoad } from 'libs/framework/http/helper';

const modelsPath = path.join(__dirname, '..', '..', 'models')
    , connection = new Sequelize(postgresConfig);

const start = async () => {
    const models = await dynamicLoad(path.resolve(modelsPath, 'postgres'));

    Object.values(models).forEach((model) => {
        console.debug('PostgreSQL Models Init %s', typeof model, model.name);
        model.init(connection);
    });

    Object.values(models).forEach((model) => {
        if (model.associate && typeof model.associate === 'function') {
            model.associate(connection.models);
            console.debug('PostgreSQL Models Associations %s', typeof model, model.name);
        }
    });

    const svg = await SequelizeErd({ source: connection });

    fs.writeFileSync(path.join(__dirname, 'incanto.svg'), svg);
}

start();
