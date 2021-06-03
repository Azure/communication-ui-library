// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackItemStyles, IStackStyles, mergeStyles } from '@fluentui/react';

export const callControlsStyles: IStackItemStyles = {
  root: {
    width: '100%'
  }
};

export const callControlsContainer = mergeStyles({
  width: '100%',
  height: '3.875rem',
  padding: '0.0625rem 0',

  overflow: 'hidden',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 2
});

export const centeredCallControlsContainer = mergeStyles(callControlsContainer, {
  justifyContent: 'center'
});

export const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    display: 'flex'
  }
};

export const subContainerStyles: IStackStyles = {
  root: {
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
    flexBasis: '0'
  }
};

export const activeContainerClassName: IStackItemStyles = {
  root: {
    display: 'flex',
    height: '100%',
    position: 'relative'
  }
};

export const loadingStyle = mergeStyles({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});
