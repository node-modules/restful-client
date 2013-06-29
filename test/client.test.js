/*!
 * restful-client - test/client.test.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var Gitlab = require('./gitlab_client');
var should = require('should');
var mm = require('mm');

describe('client.test.js', function () {
  
  var gitlab = new Gitlab({token: 'xD2u7qqskGczXKZ7Mum9', requestTimeout: 9000});

  afterEach(mm.restore);

  describe('RESTfulClient', function () {
    describe('request()', function () {
      it('should return status 200 results', function (done) {
        gitlab.projects.list(function (err, result) {
          should.not.exists(err);
          should.exists(result);
          result.length.should.above(1);
          result[0].should.have.property('id');
          done();
        });
      });

      it('should mock SyntaxError return err', function (done) {
        mm.http.request(/\//, '{w');
        gitlab.projects.list(function (err, result) {
          should.exists(err);
          err.name.should.equal('GitlabReponseFormatError');
          err.data.should.eql({resBody: '{w'});
          err.message.should.equal('Parse json error: Unexpected token w');
          err.statusCode.should.equal(200);
          should.not.exists(result);
          done();
        });
      });

      it('should mock 403 response return err', function (done) {
        mm.http.request(/\//, '{"name": "MockError", "message": "mock error", "errors": [{"field": "test"}]}', {statusCode: 403});
        gitlab.projects.list(function (err, result) {
          should.exists(err);
          err.name.should.equal('GitlabMockError');
          err.data.should.eql({resBody: {"name": "MockError", "message": "mock error", "errors": [{"field": "test"}]}});
          err.message.should.equal('mock error');
          err.statusCode.should.equal(403);
          err.errors.should.eql([{"field": "test"}]);
          should.not.exists(result);
          done();
        });
      });

      it('should mock request error', function (done) {
        mm.http.requestError(/\//, 'socket hangup');
        gitlab.projects.list(function (err, result) {
          should.exists(err);
          err.name.should.equal('GitlabMockHttpRequestError');
          err.data.should.eql({resBody: undefined});
          err.message.should.equal('socket hangup');
          should.not.exists(result);
          done();
        });
      });
    });

  });

  describe('RESTFulResource', function () {
    describe('list()', function () {
      it('should get projects of current user', function (done) {
        gitlab.projects.list({per_page: 1}, function (err, result) {
          should.not.exists(err);
          should.exists(result);
          result.should.length(1);
          result[0].should.have.property('id');
          done();
        });
      });

      it('should get empty with page = 10', function (done) {
        gitlab.projects.list({page: 10}, function (err, result) {
          should.not.exists(err);
          should.exists(result);
          result.should.eql([]);
          done();
        });
      });
    });

    describe('get()', function () {
      it('should get a project', function (done) {
        gitlab.projects.get({id: 1}, function (err, result) {
          should.not.exists(err);
          should.exists(result);
          result.name.should.equal('Diaspora');
          result.id.should.equal(1);
          result.path_with_namespace.should.equal('diaspora/diaspora');
          result.created_at.should.equal('2012-12-21T12:57:47Z');
          new Date(result.created_at).should.be.instanceof(Date);
          done();
        });
      });

      it('should get a not exists project return 404', function (done) {
        gitlab.projects.get({id: 404}, function (err, result) {
          should.exists(err);
          err.name.should.equal('Gitlab404Error');
          err.message.should.equal('404 Not Found');
          err.statusCode.should.equal(404);
          should.not.exists(result);
          done();
        });
      });
    });

    describe('create()', function () {
      it('should create a project issue', function (done) {
        gitlab.issues.create({id: 1, title: 'https://github.com/fengmk2/restful-client'}, function (err, issue) {
          should.not.exists(err);
          should.exists(issue);
          issue.should.have.property('project_id', 1);
          issue.should.have.property('id');
          issue.should.have.property('title', 'https://github.com/fengmk2/restful-client');
          gitlab.issues.remove({id: 1, issue_id: issue.id}, function (err) {
            // should.not.exists(err);
            gitlab.issues.update({id: 1, issue_id: issue.id, state_event: 'close'}, function (err, issue) {
              should.not.exists(err);
              issue.should.have.property('state', 'closed');
              done();
            });
          });
        });
      });

    });
  });

});
