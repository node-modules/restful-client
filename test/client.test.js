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

describe('client.test.js', function () {
  
  var gitlab = new Gitlab({token: 'xD2u7qqskGczXKZ7Mum9', requestTimeout: 9000});

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
    });
  });

});
