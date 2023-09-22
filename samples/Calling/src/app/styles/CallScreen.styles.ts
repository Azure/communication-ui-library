// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackItemStyles, IStackStyles } from '@fluentui/react';

export const headerStyles: IStackItemStyles = {
  root: {
    width: '100%'
  }
};
export const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  }
};
export const subContainerStyles: IStackStyles = {
  root: {
    overflow: 'hidden',
    width: '100%',
    flexBasis: '0'
  }
};
export const paneStyles: IStackItemStyles = {
  root: {
    width: '17.875rem'
  }
};
export const activeContainerClassName: IStackItemStyles = {
  root: {
    display: 'flex',
    height: '100%'
  }
};

export const loadingStyle: IStackStyles = {
  root: {
    height: '100%',
    width: '100%'
  }
};
