import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import mkdirp from 'mkdirp';
import transformStorage from 'libs/transform-storage';

export default function(name, transform={}) {
  return function({logger, module}) {
    name = name || module

    const storage = transformStorage({
      destination: function(req, file, callback) {
        const directory = path.join(process.env.DIR_ATTACHMENT, `${name}`);
        logger.debug('Storage directory %s', directory);
        mkdirp(directory, { recursive: true })
          .then(made => callback(null, directory))
          .catch(callback);
      },

      filename: function(req, file, callback) {
        const {rename} = transform,
          ext = file.originalname.split('.').pop(),
          filename = rename ? `${uuidv4()}.${ext}` : file.originalname;
        logger.debug('Storage filename %s', filename, file.mimetype, ext, file.originalname);
        callback(null, filename);
      }

    });

    return multer({storage}).any();
  }
}
