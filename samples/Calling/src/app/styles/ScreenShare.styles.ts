// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

export const videoStreamStyle = mergeStyles({
  position: 'absolute',
  bottom: '.5rem',
  right: '.5rem',
  height: '20%',
  width: '25%'
});

export const loadingStyle = mergeStyles({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});

export const videoTileStyle = {
  root: {
    borderRadius: '.25rem'
  }
};
