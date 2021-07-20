// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// This file is not used by the browser tests.
// You can use this file to run the included app standalone.
//
// $ node ./server.js
//
// This will run an app that serves the ChatComposite.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const server = express();
server.use(express.static(__dirname + '/dist'));
server.listen(3000);
