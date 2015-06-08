/**!
 * restful-client - test/gitlab_client.js
 *
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var util = require('util');
var restful = require('../');

function Project(client) {
  this.constructor.super_.call(this, client, '/projects', 'id');
}
util.inherits(Project, restful.RESTFulResource);

function Repository(client) {
  this.constructor.super_.call(this, client, '/projects/:id/repository/:type', 'branch');
}
util.inherits(Repository, restful.RESTFulResource);

/**
 * Get the raw file contents for a file.
 *
 * @param {Object} params
 *  - {String} id The ID of a project
 *  - {String} sha The commit or branch name
 *  - {String} filepath The path the file
 * @param {Function} callback
 */
Repository.prototype.getBlob = function (params, callback) {
  params.type = 'commits';
  params.contentType = 'buffer';
  this.client.request('get', this.path + '/:sha/blob', params, callback);
};

function Gitlab(options) {
  options = options || {};
  options.api = options.api || 'https://gitlab.com/api/v3';
  restful.RESTFulClient.call(this, options);

  this.token = options.token;

  this.addResources({
    projects: Project,
    repositorys: Repository,
    issues: {
      resourcePath: '/projects/:id/issues',
      idName: 'issue_id'
    }
  });
}

util.inherits(Gitlab, restful.RESTFulClient);

Gitlab.prototype.setAuthentication = function (req) {
  req.params.data.private_token = req.params.data.private_token || this.token;
  return req;
};

module.exports = Gitlab;
