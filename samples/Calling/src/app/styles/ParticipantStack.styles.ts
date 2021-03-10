// © Microsoft Corporation. All rights reserved.

import { IButtonStyles, IPersonaStyles, IStackTokens, mergeStyles } from '@fluentui/react';
import { CSSProperties } from 'react';

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

export const itemStyles: Partial<IPersonaStyles> = {
  root: {
    minWidth: 0,
    padding: '0 0.25rem',
    alignSelf: 'stretch',
    height: 'auto',
    width: '12.5rem'
  }
};

export const iconStyle = mergeStyles({
  margin: '3px'
});

export const iconsDivStyle: CSSProperties = {
  position: 'absolute',
  display: 'flex',
  right: '10%',
  top: '50%',
  msTransform: 'translateY(-50%)',
  transform: 'translateY(-50%)'
};
