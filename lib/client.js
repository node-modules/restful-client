/*!
 * restful-client - lib/client.js
 * Copyright(c) 2013 - 2014 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var debug = require('debug')('restful-client:client');
var urllib = require('urllib');
var RESTFulResource = require('./resource');

/**
 * Create a RESTful API client.
 *
 * @param {Object} options
 *  - {String} api root url, e.g.: 'http://gitlab.com/api/v3'
 *  - {String} contentType response content type, default is 'json'
 *  - {Number} requestTimeout request api timeout, default is 5000 ms
 */
function RESTFulClient(options) {
  options = options || {};
  this.api = options.api;
  this.contentType = options.contentType || 'json';
  this.requestTimeout = options.requestTimeout || 5000;
}

RESTFulClient.prototype.addResources = function (resources) {
  var client = this;
  for (var propertyName in resources) {
    var clazz = resources[propertyName];
    if (typeof clazz === 'function') {
      this[propertyName] = new clazz(client);
    } else {
      this[propertyName] = new RESTFulResource(client,
        clazz.resourcePath, clazz.idName, clazz.updateMethod);
    }
  }
};

/**
 * Set authentication info for the request
 * @param {Object} req request info
 *  - {String} url request url
 *  - {Object} params request parameters
 *   - {String} method 'GET', 'POST', 'PUT' and so on
 *   - {String} dataType response content type, default is `client.contentType`.
 *   - {Object} data contains request data paramerters
 *   - {Object} headers contains request headers
 * @return {Object} modified request info
 */
RESTFulClient.prototype.setAuthentication = function (req) {
  // child class must override this
  // return req;
};

RESTFulClient.prototype.handleResult = function (err, result, res, callback) {
  var statusCode = res && res.statusCode;
  var headers = res && res.headers || {};
  if (err) {
    if (err.name === 'SyntaxError') {
      err.name = this.constructor.name + 'ReponseFormatError';
      if (res) {
        err.message = 'Parse ' + this.contentType + ' error: ' + err.message;
      }
    } else {
      err.name = this.constructor.name + err.name;
    }
  } else if (statusCode > 300) {
    var errorInfo = result || {};
    err = new Error(errorInfo.message ? errorInfo.message : 'Unknow Error ' + statusCode);
    if (errorInfo.name) {
      err.name = this.constructor.name + errorInfo.name;
    } else {
      err.name = this.constructor.name + statusCode + 'Error';
    }
    err.errors = errorInfo.errors;
  }

  if (err) {
    err.headers = headers;
    if (Buffer.isBuffer(result)) {
      result = result.toString();
    }
    err.data = { resBody: result };
    err.statusCode = statusCode;
    result = null;
  }

  callback(err, result);
};

RESTFulClient.prototype.request = function (method, pathname, data, timeout, callback) {
  if (typeof timeout === 'function') {
    callback = timeout;
    timeout = null;
  }

  data = data || {};
  var keys = pathname.match(/\:\w+/g);
  if (keys) {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var k = key.substring(1);
      var val = data[k];
      if (val !== undefined) {
        pathname = pathname.replace(key, val);
        delete data[k];
      }
    }
  }

  var self = this;
  var url = self.api + pathname;
  var contentType = data.contentType || self.contentType;
  var params = {
    timeout: timeout || self.requestTimeout,
    method: method,
    dataType: contentType,
    data: data,
    headers: {},
  };
  var req = {url: url, params: params};
  req = self.setAuthentication(req);
  urllib.request(req.url, req.params, function (err, resData, res) {
    debug('%s %s %j: status: %s, resData: %d bytes, err: %j',
      method, url, data, res && res.statusCode, resData && resData.length || 0, err);

    self.handleResult(err, resData, res, function (err, result) {
      if (err) {
        err.url = url;
        err.method = method;
      }
      callback(err, result);
    });
  });
};

module.exports = RESTFulClient;
