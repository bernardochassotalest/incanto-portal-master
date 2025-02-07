import { kebabCase, size, truncate, get, indexOf, toLower } from 'lodash'
import moment from 'moment'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import fileConfig from 'config/files';
import debug from 'debug';

const log = debug('incanto:files:upload');

export default function(allowed) {
    allowed = allowed || ['png', 'gif', 'jpg', 'jpeg', 'pdf', 'csv', 'cmp', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'xml'];

    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            const folder = fileConfig.folders.multer;
            try {
              if (!fs.existsSync(folder)){
                  fs.mkdirSync(folder);
              }
            } catch (err) { return callback(err) }
            return callback(null, folder);
        },
        filename: function (req, file, callback) {
            let random = Math.random().toString(36).substring(2, 9),
                parsed = path.parse(file.originalname),
                original = kebabCase((size(parsed.name) < 100) ? parsed.name : truncate(parsed.name, {length: 100})),
                filename = `${moment().format('YYYYMMDDHHmmssSSS')}-${random}-${original}.${parsed.ext.replace('.','')}`;

            log(`Creating file ${filename}`)
            return callback(null, filename);
        }
    });

    const fileFilter = function(req, file, callback) {
      let parsed = path.parse(file.originalname),
          extension = toLower(parsed.ext.replace('.',''));
      if (indexOf(allowed, extension) < 0) {
        return callback(`Arquivo [${extension}] não permitido.`, false);
      }
      return callback(null, true)
    };

    const limits = { fileSize : 1024 * 1024 * 50 },
          uploadService = multer({ storage, limits, fileFilter });

    return uploadService.array('files', 12);
}