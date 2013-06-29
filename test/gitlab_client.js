/*!
 * restful-client - test/gitlab_client.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var util = require('util');
var restful = require('../');

function Project(client) {
  this.constructor.super_.call(this, client, '/projects', 'id');
}
util.inherits(Project, restful.RESTFulResource);

function Issue(client) {
  this.constructor.super_.call(this, client, '/projects/:id/issues', 'issue_id');
}
util.inherits(Issue, restful.RESTFulResource);

function Gitlab(options) {
  options = options || {};
  options.api = options.api || 'http://demo.gitlab.com/api/v3';
  this.constructor.super_.call(this, options);
  this.token = options.token;

  this.addResources({
    projects: Project,
    issues: Issue,
  });
}

util.inherits(Gitlab, restful.RESTFulClient);

Gitlab.prototype.setAuthentication = function (req) {
  req.params.data.private_token = req.params.data.private_token || this.token;
  return req;
};

module.exports = Gitlab;
