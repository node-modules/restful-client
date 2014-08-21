restful-client
=======


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/restful-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/restful-client
[travis-image]: https://img.shields.io/travis/node-modules/restful-client.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/restful-client
[coveralls-image]: https://img.shields.io/coveralls/node-modules/restful-client.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/node-modules/restful-client?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/node-modules/restful-client.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/restful-client
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/restful-client.svg?style=flat-square
[download-url]: https://npmjs.org/package/restful-client

![logo](https://raw.github.com/node-modules/restful-client/master/logo.png)

RESTFul api client base object. Usually use by some api client implementation.

Example: [gitlab](https://github.com/repo-utils/gitlab)

## Install

```bash
$ npm install restful-client --save
```

## Usage

```js
var restful = require('restful-client');
var util = require('util');

function Project(client) {
  restful.RESTFulResource.call(this, client, '/projects', 'id');
}
util.inherits(Project, restful.RESTFulResource);

function Gitlab(options) {
  options = options || {};
  options.api = options.api || 'https://gitlab.com/api/v3';
  restful.RESTFulClient.call(this, options);
  this.token = options.token;

  this.addResources({
    projects: Project
  });
}

util.inherits(Gitlab, restful.RESTFulClient);

Gitlab.prototype.setAuthentication = function (req) {
  req.params.data.private_token = req.params.data.private_token || this.token;
  return req;
};

var gitlab = new Gitlab({token: 'your token', requestTimeout: 5000});
gitlab.projects.list({page: 1}, function (err, result) {
  console.log(arguments);
});
```

## License

(The MIT License)

Copyright (c) 2013 - 2014 fengmk2 &lt;fengmk2@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
