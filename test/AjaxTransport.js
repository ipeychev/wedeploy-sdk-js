import AjaxTransport from '../src/AjaxTransport';
import ClientRequest from '../src/ClientRequest';

describe('AjaxTransport', function () {

  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();

    var requests = this.requests = [];

    this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
    };
  });

  afterEach(function() {
    this.xhr.restore();
  });

  it('should send request to an url', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual('/url', response.request().url());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send request with different http method', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    clientRequest.method('POST');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual('POST', response.request().method());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send request with body', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    clientRequest.body('requestBody');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual('requestBody', response.request().body());
      assert.strictEqual('responseBody', response.body());
      done();
    });
    this.requests[0].respond(200, null, 'responseBody');
  });

  it('should send request with query string', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    clientRequest.query('query', 1);
    transport.send(clientRequest).then(function(response) {
      assert.deepEqual([{name: 'query', value: 1}], response.request().queries());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send request with header', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    clientRequest.header('Content-Type', 'application/json');
    transport.send(clientRequest).then(function(response) {
      assert.deepEqual([{name: 'Content-Type', value: 'application/json'}], response.request().headers());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should send request with multiple header of same name', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    clientRequest.header('Content-Type', 'application/json');
    clientRequest.header('Content-Type', 'text/html');
    transport.send(clientRequest).then(function(response) {
      assert.deepEqual([{name: 'Content-Type', value: 'application/json'}, {name: 'Content-Type', value: 'text/html'}], response.request().headers());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should response with headers', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    transport.send(clientRequest).then(function(response) {
      assert.deepEqual([{name: 'Content-Type', value: 'application/json'}], response.headers());
      done();
    });
    this.requests[0].respond(200, { 'Content-Type': 'application/json' });
  });

  it('should response success with status code 200', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(200, response.statusCode());
      done();
    });
    this.requests[0].respond(200);
  });

  it('should response success with status code 304', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    transport.send(clientRequest).then(function(response) {
      assert.strictEqual(304, response.statusCode());
      done();
    });
    this.requests[0].respond(304);
  });

  it('should error with any other status code than 200 or 304', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url');
    transport.send(clientRequest).catch(function(reason) {
      assert.ok(reason instanceof Error);
      done();
    });
    this.requests[0].respond(500);
  });

  it('should parse request query string', function (done) {
    var transport = new AjaxTransport();
    var clientRequest = new ClientRequest();
    clientRequest.url('/url?foo=1');
    clientRequest.query('query', 1);
    clientRequest.query('query', ' ');
    transport.request(
          clientRequest.url(), clientRequest.method(), null,
          clientRequest.queries(), null, false).then(function(xhrResponse) {
            assert.strictEqual('/url?foo=1&query=1&query=%20', xhrResponse.url);
            done();
          });
    this.requests[0].respond(200);
  });

});