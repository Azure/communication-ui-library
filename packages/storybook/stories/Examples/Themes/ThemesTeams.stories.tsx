// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { getDocs } from './ThemesDocs';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import {
  FluentThemeProvider,
  GridLayout,
  VideoTile,
  ControlBar,
  videoButtonProps,
  audioButtonProps,
  screenShareButtonProps,
  hangupButtonProps
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

const TeamsTheme = {
  palette: {
    themePrimary: '#4b53bc',
    themeLighterAlt: '#f6f7fc',
    themeLighter: '#dddef4',
    themeLight: '#c1c4eb',
    themeTertiary: '#8a8fd7',
    themeSecondary: '#5d64c5',
    themeDarkAlt: '#444baa',
    themeDark: '#393f8f',
    themeDarker: '#2a2e6a',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff'
  }
};

export const TeamsThemeComponent: () => JSX.Element = () => {
  return (
    <div>
      <FluentThemeProvider fluentTheme={TeamsTheme}>
        {/*Control Bar with default set up*/}
        <ControlBar layout={'dockedTop'}>
          <DefaultButton
            {...videoButtonProps}
            onClick={() => {
              /*handle onClick*/
            }}
          />
          <DefaultButton
            {...audioButtonProps}
            onClick={() => {
              /*handle onClick*/
            }}
          />
          <DefaultButton
            {...screenShareButtonProps}
            onClick={() => {
              /*handle onClick*/
            }}
          />
          <DefaultButton
            {...hangupButtonProps}
            onClick={() => {
              /*handle onClick*/
            }}
          />
        </ControlBar>
        {/*Control Bar with default set up*/}
        <div
          style={{
            height: '530px',
            width: '830px'
          }}
        >
          <GridLayout>
            <VideoTile isVideoReady={false} videoProvider={null} avatarName={'Michael'}>
              <label>Michael</label>
            </VideoTile>
          </GridLayout>
        </div>
      </FluentThemeProvider>
    </div>
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/Themes`,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
