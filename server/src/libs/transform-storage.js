import fs from 'fs';
import path from 'path';
import _ from 'lodash';

function getDestination(req, file, cb) {
  cb(null, '/dev/null')
}

function getFilename(req, file, cb) {
  cb(null, file.originalname);
}

function TransformStorage(opts) {
  this.getDestination = (opts.destination || getDestination);
  this.getFilename = (opts.filename || getFilename);
  this.transforms = opts.transforms || _.noop;
}

TransformStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  const fnFilename = this.getFilename.bind(this);
  const fnDestination = this.getDestination.bind(this);
  const fnTransforms = this.transforms.bind(this);

  fnFilename(req, file, function(err, filename) {
    if (err) return cb(err);

    fnDestination(req, file, function(err, directory) {
      if (err) return cb(err);

      const filepath = path.resolve(directory, filename);
      const outStream = fs.createWriteStream(filepath);
      const transform = !fnTransforms
        ? null
        : (typeof fnTransforms === 'function' && fnTransforms());

      if (transform) {
        file.stream.pipe(transform).pipe(outStream);
      } else {
        file.stream.pipe(outStream);
      }

      outStream.on('error', cb);
      outStream.on('finish', function() {
        cb(null, {
          path: filepath,
          size: outStream.bytesWritten
        });
      });
    });
  });
}

TransformStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  fs.unlink(file.path, cb);
}

module.exports = function(opts) {
  return new TransformStorage(opts);
}
