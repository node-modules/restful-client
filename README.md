restful-client [![Build Status](https://secure.travis-ci.org/fengmk2/restful-client.png)](http://travis-ci.org/fengmk2/restful-client) [![Coverage Status](https://coveralls.io/repos/fengmk2/restful-client/badge.png)](https://coveralls.io/r/fengmk2/restful-client) [![Build Status](https://drone.io/github.com/fengmk2/restful-client/status.png)](https://drone.io/github.com/fengmk2/restful-client/latest)
=======

![logo](https://raw.github.com/fengmk2/restful-client/master/logo.png)

RESTFul api client base object. Usually use by some api client implementation.

Example: [gitlab](https://github.com/fengmk2/gitlab)

## Install

```bash
$ npm install restful-client
```

## Usage

```js
var restful = require('restful-client');
var util = require('util');

function Project(client) {
  this.constructor.super_.call(this, client, '/projects', 'id');
}
util.inherits(Project, restful.RESTFulResource);

function Gitlab(options) {
  options = options || {};
  options.api = options.api || 'https://gitlab.com/api/v3';
  this.constructor.super_.call(this, options);
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

Copyright (c) 2013 fengmk2 &lt;fengmk2@gmail.com&gt;

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
