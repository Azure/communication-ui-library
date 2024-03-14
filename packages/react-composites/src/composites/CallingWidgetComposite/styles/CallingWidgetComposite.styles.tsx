// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, ICheckboxStyles, IIconStyles, IStackStyles, Theme } from '@fluentui/react';
import { WidgetPosition } from '../CallingWidgetComposite';

export const checkboxStyles = (theme: Theme): ICheckboxStyles => {
  return {
    label: {
      color: theme.palette.neutralPrimary
    }
  };
};

export const callingWidgetContainerStyles = (theme: Theme, position: WidgetPosition): IStackStyles => {
  return {
    root: {
      minWidth: '5rem',
      minHeight: '5rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: '50%',
      top: position === 'topLeft' || position === 'topRight' ? '1rem' : 'unset',
      bottom: position === 'bottomRight' || position === 'bottomLeft' ? '1rem' : 'unset',
      right: position === 'bottomRight' || position === 'topRight' ? '1rem' : 'unset',
      left: position === 'bottomLeft' || position === 'topLeft' ? '1rem' : 'unset',
      position: 'absolute',
      cursor: 'pointer',
      ':hover': {
        boxShadow: theme.effects.elevation64
      }
    }
  };
};

export const callingWidgetCustomWaitContainerStyles = (theme: Theme, position: WidgetPosition): IStackStyles => {
  return {
    root: {
      top: position === 'topLeft' || position === 'topRight' ? '1rem' : 'unset',
      bottom: position === 'bottomRight' || position === 'bottomLeft' ? '1rem' : 'unset',
      right: position === 'bottomRight' || position === 'topRight' ? '1rem' : 'unset',
      left: position === 'bottomLeft' || position === 'topLeft' ? '1rem' : 'unset',
      position: 'absolute',
      cursor: 'pointer'
    }
  };
};

export const callingWidgetSetupContainerStyles = (theme: Theme, position: WidgetPosition): IStackStyles => {
  return {
    root: {
      width: '18rem',
      minHeight: '25rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      top: position === 'topLeft' || position === 'topRight' ? '1rem' : 'unset',
      bottom: position === 'bottomRight' || position === 'bottomLeft' ? '1rem' : 'unset',
      right: position === 'bottomRight' || position === 'topRight' ? '1rem' : 'unset',
      left: position === 'bottomLeft' || position === 'topLeft' ? '1rem' : 'unset',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      background: theme.palette.white
    }
  };
};

export const callIconStyles = (theme: Theme): IIconStyles => {
  return {
    root: {
      paddingTop: '0.2rem',
      color: theme.palette.white,
      transform: 'scale(1.6)'
    }
  };
};

export const startCallButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      background: theme.palette.themePrimary,
      borderRadius: theme.effects.roundedCorner6,
      borderColor: theme.palette.themePrimary
    },
    textContainer: {
      color: theme.palette.white
    }
  };
};

export const logoContainerStyles: IStackStyles = {
  root: {
    margin: 'auto',
    padding: '1.4rem',
    height: '5rem',
    width: '10rem',
    zIndex: 0
  }
};

export const collapseButtonStyles: IButtonStyles = {
  root: {
    position: 'absolute',
    top: '0rem',
    right: '0rem',
    zIndex: 1
  }
};

export const callingWidgetInCallContainerStyles = (theme: Theme, position: WidgetPosition): IStackStyles => {
  return {
    root: {
      width: '35rem',
      height: '25rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      top: position === 'topLeft' || position === 'topRight' ? '1rem' : 'unset',
      bottom: position === 'bottomRight' || position === 'bottomLeft' ? '1rem' : 'unset',
      right: position === 'bottomRight' || position === 'topRight' ? '1rem' : 'unset',
      left: position === 'bottomLeft' || position === 'topLeft' ? '1rem' : 'unset',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      background: theme.semanticColors.bodyBackground
    }
  };
};
