// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Examples } from './Examples';
import { _IdentifierProvider } from '@azure/communication-react';

if (document.getElementById('root') !== undefined) {
  ReactDOM.render(
    <div className="wrapper">
      <Examples />
    </div>,
    document.getElementById('root')
  );
}
