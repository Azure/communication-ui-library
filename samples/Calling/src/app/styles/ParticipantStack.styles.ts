// © Microsoft Corporation. All rights reserved.

import { IButtonStyles, IStackTokens, mergeStyles } from '@fluentui/react';

export const overFlowButtonStyles: IButtonStyles = {
  root: {
    minWidth: 0,
    padding: '0 0.25rem',
    alignSelf: 'stretch',
    height: 'auto'
  }
};

export const participantStackStyle = mergeStyles({
  maxHeight: '21.875rem',
  overflow: 'auto',
  paddingLeft: '1.125rem',
  paddingRight: '1.125rem'
});

export const participantStackTokens: IStackTokens = {
  childrenGap: '0.625rem',
  padding: '0.625rem'
};
