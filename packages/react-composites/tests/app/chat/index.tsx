// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initializeIconsForUITests } from '../lib/utils';
import { FakeAdapterApp } from './FakeAdapterApp';
import { LiveTestApp } from './LiveTestApp';
import './index.css';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Needed to initialize default icons used by Fluent components.
initializeFileTypeIcons();
initializeIconsForUITests();

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('Failed to find the root element');
}

createRoot(domNode).render(params.fakeChatAdapterArgs ? <FakeAdapterApp /> : <LiveTestApp />);
