// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Examples } from './Examples';
import { _IdentifierProvider } from '@azure/communication-react';

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('Failed to find the root element');
}

createRoot(domNode).render(
  <div className="wrapper">
    <Examples />
  </div>
);
