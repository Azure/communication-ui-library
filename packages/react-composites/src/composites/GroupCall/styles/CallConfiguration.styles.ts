// © Microsoft Corporation. All rights reserved.

import { IStackTokens, mergeStyles } from '@fluentui/react';

export const configurationStackTokens: IStackTokens = {
  childrenGap: '3rem'
};
export const mainContainerStyle = mergeStyles({
  width: '100%',
  height: '100%',
  selectors: {
    '@media (max-width: 750px)': {
      padding: '0.625rem',
      height: '100%'
    }
  }
});
export const localSettingsContainerStyle = mergeStyles({
  width: '100%',
  maxWidth: '18.75rem'
});
export const fullScreenStyle = mergeStyles({
  height: '100%',
  width: '100%'
});
export const verticalStackStyle = mergeStyles({
  height: '100%',
  width: '100%',
  justifyContent: 'space-evenly'
});
