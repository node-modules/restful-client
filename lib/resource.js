/*!
 * restful-client - lib/resource.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

/**
 * RESTFul Resource base class.
 *
 * @param {Client} client RESTful api client instance.
 * @param {String} resourcePath resource url path, e.g.: '/issues'
 * @param {String} idName id name for get one entry, e.g.: 'id', 'name'
 * @param {String} [updateMethod] update http method, default is 'put'
 */
function RESTFulResource(client, resourcePath, idName, updateMethod) {
  this.client = client;
  this.path = resourcePath;
  this.onePath = this.path + (idName ? '/:' + idName : '');
  this.updateMethod = updateMethod || 'put';
}

/**
 * Get a resource.
 *
 * @param {Object} params
 * @param {Function(err, row)} callback
 */
RESTFulResource.prototype.get = function (params, callback) {
  this.client.request('get', this.onePath, params, callback);
};

/**
 * List all resources.
 *
 * @param {Object} params
 * @param {Function(err, rows)} callback
 */
RESTFulResource.prototype.list = function (params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }
  this.client.request('get', this.path, params, callback);
};

/**
 * Create a resource.
 *
 * @param {Object} params
 * @param {Function(err, row)} callback
 */
RESTFulResource.prototype.create = function (params, callback) {
  this.client.request('post', this.path, params, callback);
};

/**
 * Update a resource.
 *
 * @param {Object} params
 * @param {Function(err, row)} callback
 */
RESTFulResource.prototype.update = function (params, callback) {
  this.client.request(this.updateMethod, this.onePath, params, callback);
};

/**
 * Remove a resource.
 *
 * @param {Object} params
 * @param {Function(err, row)} callback
 */
RESTFulResource.prototype.remove = function (params, callback) {
  this.client.request('delete', this.onePath, params, callback);
};

module.exports = RESTFulResource;
