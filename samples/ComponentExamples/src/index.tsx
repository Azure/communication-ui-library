// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Examples } from './Examples';

if (document.getElementById('root') !== undefined) {
  ReactDOM.render(
    <div className="wrapper">
      <Examples />
    </div>,
    document.getElementById('root')
  );
}
