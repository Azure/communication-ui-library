// © Microsoft Corporation. All rights reserved.

import { IStackStyles, mergeStyles } from '@fluentui/react';

export const fullHeightStyles: IStackStyles = {
  root: {
    height: '100%',
    overflowY: 'auto'
  }
};

export const paneHeaderStyle = mergeStyles({
  height: '2.8125rem'
});

export const paneHeaderTextStyle = mergeStyles({
  fontSize: '1.375rem',
  fontWeight: 600,
  width: '69px',
  float: 'left',
  margin: '20px'
});

export const settingsContainerStyle = mergeStyles({
  marginLeft: '1.25rem',
  width: '15.375rem'
});
