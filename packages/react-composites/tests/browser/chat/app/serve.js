// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const server = express();
server.use(express.static(__dirname + '/dist'));
server.listen(3000);
