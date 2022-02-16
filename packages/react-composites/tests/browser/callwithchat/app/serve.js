// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// This file is not used by the browser tests.
// You can use this file to run the included app standalone.
//
// $ node ./serve.js
//
// This will run an app that serves the ChatComposite.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const server = express();
server.use(express.static(__dirname + '/dist'));
const listener = server.listen(3000);
console.log('Server listening at: http://localhost:' + listener.address().port);
