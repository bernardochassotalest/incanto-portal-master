import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import mime from 'mime-types';
import { isBuffer } from 'commons/helper'

export default class Response {
  constructor(response) {
    this.response = response;
  }

  raw = () => {
    return this.response;
  }

  json = (data) => {
    this.response.json(data);
  }

  download = (filepath, omit) => {
    const filename = path.basename(filepath) || ''
        , mimeType = mime.lookup(filepath);

    if (!fs.existsSync(filepath)) {
      throw new ApiError('file not found');
    }

    const readStream = fs.createReadStream(filepath);

    this.response.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    this.response.setHeader('Content-type', mimeType);
    this.response.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    readStream.pipe(this.response);
  }

  downloadBuffer = (contents, filename) => {
    this.response.writeHead(200, {
      'Content-disposition': `attachment; filename=${filename}`,
      'Content-Transfer-Encoding': 'binary',
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'private, no-cache, no-store, must-revalidate'
    });

    if (!isBuffer(contents) && !_.isString(contents)) {
      console.log('Invalid Buffer: ', contents)
      contents = Buffer.from('');
    }
    this.response.end(contents);
  }
}
