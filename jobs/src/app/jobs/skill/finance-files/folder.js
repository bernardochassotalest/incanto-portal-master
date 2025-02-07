import _ from 'lodash';
import fs from 'fs'
import path from 'path'
import debug from 'debug';
import { postgres } from 'app/models';
import { moveFile, createFolder } from 'app/lib/utils'
import libAsync from 'async';
import axios from 'axios'
import FormData from 'form-data'
import Queue from 'app/lib/queue';
import fileConfig from 'config/files';

const log = debug('incanto:skill:finances:folder');

export default {
    key: 'SkillFinanceFilesFolder',
    async handle({ data }) {
        try {
            await uploadFiles(data);
        } catch (err) {
            log(`Error: ${err}`)
        }
    }
};

const uploadFiles = async (params) => {
    return new Promise(async (resolve, reject) => {
        let actions = [];

        actions.push(function (next) {
            createFolders(params, next);
        });

        actions.push(function (params, next) {
            getListFiles(params, next);
        });

        actions.push(function (params, next) {
            processFiles(params, next);
        });

        actions.push(function (params, next) {
            moveFiles(params, next);
        });

        libAsync.waterfall(actions, function (err, result) {
            if (err) {
                return reject(err);
            }
            Queue.add('SkillFinanceFilesProcess', {})
            resolve({ 'result': result });
        });
    })
}

const createFolders = async (params, callback) => {
    const inbox = path.join(fileConfig.folders.server, fileConfig.van, 'inbox');
    const processed = path.join(fileConfig.folders.server, fileConfig.van, 'processed');

    await createFolder(inbox);
    await createFolder(processed);

    return callback(null, params);
}

const getListFiles = async (params, callback) => {
    const folder = path.join(fileConfig.folders.server, fileConfig.van, 'inbox');

    fs.readdir(folder, function (err, dirFiles) {
        let result = [];
        const files = dirFiles.filter((f) => f !== '.DS_Store');
        for (var i = 0; i < files.length; i++) {
            var item = files[i],
                name = path.join(folder, item);
            result.push(name);
        }

        params['files'] = result;

        return callback(null, params);
    });
}

const processFiles = async (params, callback) => {
    let files = params.files,
        token = _.get(params, 'token', ''),
        forEach = async (fileName) => {
            const url = `http://localhost:${process.env.HTTP_PORT}/jobs/skill/finance-files/upload`,
                form = new FormData(),
                stream = fs.createReadStream(fileName),
                formHeaders = form.getHeaders(),
                options = {
                    'headers': { ...formHeaders, 'Authorization': token },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                };

            form.append('files', stream);

            const response = await axios.post(url, form, options);
        };

    libAsync.eachSeries(files, libAsync.asyncify(forEach), function (err) {
        return callback(err, params);
    });
}

const moveFiles = async (params, callback) => {
    const processed = path.join(fileConfig.folders.server, fileConfig.van, 'processed');
    let files = params.files,
        forEach = async (fileName) => {
            let fullName = path.join(processed, path.basename(fileName));

            await moveFile(fileName, fullName)
        };

    libAsync.eachSeries(files, libAsync.asyncify(forEach), function (err) {
        return callback(err, params);
    });
}