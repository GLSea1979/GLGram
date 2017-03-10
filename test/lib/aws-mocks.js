'use strict';

const AWS = require('aws-sdk-mock');

module.exports = exports = {};

exports.uploadMock = {
  ETag: '"1234abcd"',
  Location: 'https://fakeurl.com/fake.png',
  Key: '1234.png',
  key: '1234.png',
  Bucket: 'glgram'
};

AWS.mock('S3', 'upload', function(params, callback) {
  if (!params.ACL === 'public-read') {
    return callback(new Error('ACL must be public-read'));
  };

  if (!params.Bucket === 'glgram') {
    return callback(new Error('Bucket must be cfgram'));
  };

  if (!params.Key) {
    return callback(new Error('Key required'));
  };

  if (!params.Body) {
    return callback(new Error('Body required'));
  };

  callback(null, exports.uploadMock);
});
