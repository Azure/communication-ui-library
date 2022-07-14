// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import { initializeIconsForUITests } from '../../common/testAppUtils';
import { HermeticApp, shouldLoadHermeticApp } from './HermeticApp';
import { LiveApp } from './LiveApp';
import { parseQueryArgs } from './QueryArgs';

const queryArgs = parseQueryArgs();
initializeIconsForUITests();

ReactDOM.render(
  shouldLoadHermeticApp(queryArgs) ? <HermeticApp queryArgs={queryArgs} /> : <LiveApp queryArgs={queryArgs} />,
  document.getElementById('root')
);
