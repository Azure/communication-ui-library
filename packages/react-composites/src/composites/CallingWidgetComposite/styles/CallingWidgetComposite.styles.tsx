// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, ICheckboxStyles, IIconStyles, IStackStyles, Theme } from '@fluentui/react';

export const checkboxStyles = (theme: Theme): ICheckboxStyles => {
  return {
    label: {
      color: theme.palette.neutralPrimary
    }
  };
};

export const callingWidgetContainerStyles = (theme: Theme): IStackStyles => {
  return {
    root: {
      width: '5rem',
      height: '5rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: '50%',
      bottom: '1rem',
      right: '1rem',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      ':hover': {
        boxShadow: theme.effects.elevation64
      }
    }
  };
};

export const callingWidgetSetupContainerStyles = (theme: Theme): IStackStyles => {
  return {
    root: {
      width: '18rem',
      minHeight: '20rem',
      maxHeight: '25rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      bottom: 0,
      right: '1rem',
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
    padding: '0.2rem',
    height: '5rem',
    width: '10rem',
    zIndex: 0
  }
};

export const collapseButtonStyles: IButtonStyles = {
  root: {
    position: 'absolute',
    top: '0.2rem',
    right: '0.2rem',
    zIndex: 1
  }
};

export const callingWidgetInCallContainerStyles = (theme: Theme): IStackStyles => {
  return {
    root: {
      width: '35rem',
      height: '25rem',
      padding: '0.5rem',
      boxShadow: theme.effects.elevation16,
      borderRadius: theme.effects.roundedCorner6,
      bottom: 0,
      right: '1rem',
      position: 'absolute',
      overflow: 'hidden',
      cursor: 'pointer',
      background: theme.semanticColors.bodyBackground
    }
  };
};
