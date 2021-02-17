// © Microsoft Corporation. All rights reserved.

import './index.css';

import * as siteVariables from '@fluentui/react-northstar/dist/es/themes/teams/siteVariables';

import { Provider, mergeThemes, teamsTheme } from '@fluentui/react-northstar';

import App from './app/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { svgIconStyles } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/es/themes/teams/components/SvgIcon/svgIconVariables';

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

if (document.getElementById('root') !== undefined) {
  ReactDOM.render(
    <Provider theme={mergeThemes(iconTheme, teamsTheme)} className="wrapper">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <App />
    </Provider>,
    document.getElementById('root')
  );
}
