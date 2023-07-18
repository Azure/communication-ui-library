// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeIconsForUITests } from '../lib/utils';
import { HermeticApp, shouldLoadHermeticApp } from './HermeticApp';
import { LiveApp } from './LiveApp';
import { parseQueryArgs } from './QueryArgs';

initializeIconsForUITests();
const queryArgs = parseQueryArgs();

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('Failed to find the root element');
}

createRoot(domNode).render(
  shouldLoadHermeticApp(queryArgs) ? <HermeticApp queryArgs={queryArgs} /> : <LiveApp queryArgs={queryArgs} />
);
