// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IOverflowSetStyles, mergeStyles } from '@fluentui/react';

export const participantListStyle = mergeStyles({
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
