// © Microsoft Corporation. All rights reserved.
import { getTheme, IStyle } from '@fluentui/react';
import { ControlButtonStylesProps } from '../ControlBar';

const theme = getTheme();
const palette = theme.palette;

interface IControlBarStyles {
  horizontal: IStyle;
  vertical: IStyle;
  dockedTop: IStyle;
  dockedBottom: IStyle;
  dockedLeft: IStyle;
  dockedRight: IStyle;
  floatingTop: IStyle;
  floatingBottom: IStyle;
  floatingLeft: IStyle;
  floatingRight: IStyle;
}

export const controlBarStyles: IControlBarStyles = {
  horizontal: {
    flexFlow: 'row nowrap'
  },
  vertical: {
    flexFlow: 'column nowrap'
  },
  dockedTop: {
    flexFlow: 'row nowrap',
    boxShadow: theme.effects.elevation4,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  },
  dockedBottom: {
    flexFlow: 'row nowrap',
    boxShadow: theme.effects.elevation16,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  dockedLeft: {
    justifyContent: 'center',
    boxShadow: theme.effects.elevation4,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%'
  },
  dockedRight: {
    justifyContent: 'center',
    boxShadow: theme.effects.elevation4,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  },
  floatingTop: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation4,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  floatingBottom: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation4,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  floatingLeft: {
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation4,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    left: '1rem',
    transform: 'translateY(-50%)'
  },
  floatingRight: {
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation4,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)'
  }
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
