// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'; // this should point to your App.tsx file

ReactDOM.render(
  <div className="wrapper">
    <App />
  </div>,
  document.getElementById('root')
);
