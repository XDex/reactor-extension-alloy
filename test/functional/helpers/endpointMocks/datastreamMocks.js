/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { RequestMock } from "testcafe";
import responseHeaders from "./responseHeaders";

const DATASTREAM_ENDPOINT_REGEX = /\/edge\/datasets\/datastreams\/records\/.+/;
const specificDatastream = /\/edge\/datasets\/datastreams\/records\/64c31a3b-d031-4a2f-8834-e96fc15d3030/;

export const basic = RequestMock()
  .onRequestTo({
    url: specificDatastream,
    headers: {
      "x-sandbox-name": "testsandbox1"
    },
    method: "GET"
  })
  .respond(
    {
      data: {
        title: "test datastream"
      },
      orgId: "test@AdobeOrg",
      sandboxName: "testsandbox1",
      _system: {
        id: "64c31a3b-d031-4a2f-8834-e96fc15d3030"
      }
    },
    200,
    responseHeaders
  );

export const notExist = RequestMock()
  .onRequestTo({
    url: specificDatastream,
    headers: {
      "x-sandbox-name": "testsandbox2"
    },
    method: "GET"
  })
  .respond({}, 404, responseHeaders);

export const unauthorized = RequestMock()
  .onRequestTo({ url: DATASTREAM_ENDPOINT_REGEX, method: "GET" })
  .respond(
    {
      error_code: "401013",
      message: "Oauth token is not valid"
    },
    401,
    responseHeaders
  );
