// © Microsoft Corporation. All rights reserved.

import { getTheme, IStyle, IButtonStyles, concatStyleSets } from '@fluentui/react';

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
    flexFlow: 'column nowrap',
    maxWidth: '3.5rem'
  },
  dockedTop: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  },
  dockedBottom: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  dockedLeft: {
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%'
  },
  dockedRight: {
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  },
  floatingTop: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation16,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10
  },
  floatingBottom: {
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation16,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10
  },
  floatingLeft: {
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation16,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    left: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 10
  },
  floatingRight: {
    flexFlow: 'column nowrap',
    justifyContent: 'center',
    boxShadow: theme.effects.elevation16,
    borderRadius: theme.effects.roundedCorner6,
    overflow: 'hidden',
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 10
  }
};

export const controlButtonStyles: IButtonStyles = {
  root: {
    background: 'none',
    border: 'none',
    borderRadius: 0,
    minHeight: '3.5rem',
    minWidth: '3.5rem'
  },
  flexContainer: {
    flexFlow: 'column',
    display: 'contents'
  }
};

export const controlButtonLabelStyles: IStyle = {
  fontSize: '0.625rem',
  lineHeight: '1rem',
  marginTop: '0.125rem'
};

export const hangUpControlButtonStyles: IButtonStyles = concatStyleSets(controlButtonStyles, {
  root: {
    background: palette.redDark,
    color: palette.white
  },
  rootHovered: {
    background: palette.red,
    color: palette.white
  },
  label: {
    color: palette.whiteTranslucent40
  }
});
