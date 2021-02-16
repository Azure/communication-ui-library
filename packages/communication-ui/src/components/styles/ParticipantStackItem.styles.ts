// © Microsoft Corporation. All rights reserved.
import { getTheme, IPersonaStyles, mergeStyles } from '@fluentui/react';
import { CSSProperties } from 'react';

export const itemStyles: Partial<IPersonaStyles> = {
  root: {
    minWidth: 0,
    padding: '0 0.25rem',
    alignSelf: 'stretch',
    height: 'auto',
    width: '12.5rem'
  },
  primaryText: {
    color: getTheme().palette.black
  }
};

export const iconStyle = mergeStyles({
  margin: '3px'
});

export const participantStackItemStyle: CSSProperties = { position: 'relative' };

export const iconsDivStyle: CSSProperties = {
  position: 'absolute',
  display: 'flex',
  right: '10%',
  top: '50%',
  msTransform: 'translateY(-50%)',
  transform: 'translateY(-50%)'
};
