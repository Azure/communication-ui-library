// © Microsoft Corporation. All rights reserved.

import { IButtonStyles, IOverflowSetStyles, mergeStyles } from '@fluentui/react';

export const participantStackStyle = mergeStyles({
  maxHeight: '21.875rem',
  overflow: 'auto',
  paddingLeft: '1.125rem',
  paddingRight: '1.125rem'
});

export const overFlowButtonStyles: IButtonStyles = {
  root: {
    minWidth: 0,
    padding: '0 0.25rem',
    alignSelf: 'stretch',
    height: 'auto'
  }
};

export const overflowSetStyle: IOverflowSetStyles = {
  item: {
    width: '100%'
  }
};
