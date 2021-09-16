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
  height: '3.875em',
  padding: '0.0625rem 0',

  overflow: 'hidden',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
  justifyContent: 'center',

  '@media screen and (max-width: 30rem)': {
    label: {
      display: 'none'
    }
  }
});

export const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    position: 'relative'
  }
};

export const subContainerStyles: IStackStyles = {
  root: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    minHeight: '10em' // space affordance to ensure media gallery has minimum space allocated
  }
};

export const mediaGalleryContainerStyles: IStackItemStyles = {
  root: {
    height: '100%'
  }
};

export const bannersContainerStyles: IStackStyles = {
  root: {
    width: '100%',
    position: 'absolute',
    // High enough to be above the video gallary.
    zIndex: 9,
    top: 0,
    left: 0,
    padding: '1em'
  }
};
