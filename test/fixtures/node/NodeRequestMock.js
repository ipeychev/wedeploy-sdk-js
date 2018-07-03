/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Liferay, Inc. nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * @ignore
 */

'use strict';

import nock from 'nock';
import url from 'url';

let defVerb_;
let defAddress_;

/* eslint-disable max-len,require-jsdoc */
class NodeRequestMock {
  static inject(name, module) {
    NodeRequestMock[name] = module;
  }

  static intercept(
    verb = defVerb_,
    address = defAddress_,
    requestBody = undefined,
    reqMeta = undefined
  ) {
    let u = url.parse(address);

    NodeRequestMock.scope = nock(
      u.protocol + '//' + u.hostname,
      reqMeta
    ).intercept(u.path, verb, requestBody);

    return NodeRequestMock.scope;
  }

  static socketDelay(time) {
    NodeRequestMock.scope.socketDelay(time);
    return NodeRequestMock.scope;
  }

  static reply(status, body, headers) {
    NodeRequestMock.scope.reply(status, body, headers);
    return NodeRequestMock.scope;
  }

  static get() {
    return NodeRequestMock.scope;
  }

  static getUrl() {
    return NodeRequestMock.get()
      ._key.split(' ')[1]
      .replace(':80', '');
  }

  static setup(defVerb = 'GET', defAddress = 'http://localhost/users') {
    defVerb_ = defVerb;
    defAddress_ = defAddress;
  }

  static teardown() {
    NodeRequestMock.scope = undefined;
    nock.cleanAll();
  }
}

export default NodeRequestMock;
