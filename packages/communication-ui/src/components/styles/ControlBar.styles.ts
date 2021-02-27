// © Microsoft Corporation. All rights reserved.
import { getTheme, IStyle } from '@fluentui/react';
import { ControlButtonStylesProps } from '../ControlBar';

// © Microsoft Corporation. All rights reserved.
const theme = getTheme();
const palette = theme.palette;

export const controlBarStyle: IStyle = {
  borderRadius: '0.5rem',
  boxShadow: theme.effects.elevation4,
  overflow: 'hidden',
  background: palette.white
};

export const controlButtonStyles: IStyle = {
  background: 'none',
  border: 'none',
  borderRadius: 0,
  minHeight: '56px',
  minWidth: '56px'
};

export const controlButtonLabelStyles: IStyle = {
  fontSize: '0.75rem',
  color: palette.blackTranslucent40,
  lineHeight: '1.25rem'
};

export const hangUpControlButtonStyles: ControlButtonStylesProps = {
  root: {
    background: palette.redDark,
    color: palette.white,
    ':hover': {
      background: palette.red,
      color: palette.white
    }
  },
  label: {
    color: palette.whiteTranslucent40
  }
};
