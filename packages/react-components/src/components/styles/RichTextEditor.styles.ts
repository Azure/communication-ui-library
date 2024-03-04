// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IButtonStyles, ICommandBarStyles, IContextualMenuStyles, IStyle, Theme, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const richTextEditorStyle = mergeStyles({
  border: 'none',
  overflow: 'auto',
  padding: '10px',
  outline: 'none',
  bottom: '0',
  minHeight: '2.25rem',
  maxHeight: '8.25rem'
});

/**
 * @private
 */
export const ribbonOverflowButtonStyle = (theme: Theme): Partial<IContextualMenuStyles> => {
  return {
    subComponentStyles: {
      menuItem: {
        icon: { color: theme.palette.neutralPrimary, paddingTop: '0.5rem' },
        root: ribbonOverflowButtonRootStyles(theme)
      },
      callout: {}
    }
  };
};

const ribbonOverflowButtonRootStyles = (theme: Theme): IStyle => {
  return {
    selectors: {
      // Icon's color doesn't work here because of the specificity
      '&:hover': {
        selectors: {
          '.ms-ContextualMenu-icon': {
            color: theme.palette.neutralPrimary
          }
        }
      }
    }
  };
};

const ribbonButtonRootStyles = (theme: Theme): IStyle => {
  return {
    backgroundColor: 'transparent',
    selectors: {
      // Icon's color doesn't work here because of the specificity
      '.ms-Button-icon': {
        color: theme.palette.themePrimary
      },
      '.ms-Button-menuIcon': {
        color: theme.palette.themePrimary
      }
    }
  };
};

/**
 * @private
 */
export const ribbonButtonStyle = (theme: Theme): Partial<IButtonStyles> => {
  return {
    icon: { color: theme.palette.neutralPrimary, height: 'auto' },
    menuIcon: { color: theme.palette.neutralPrimary, height: 'auto' },
    root: { minWidth: 'auto', backgroundColor: 'transparent' },
    rootChecked: ribbonButtonRootStyles(theme),
    rootHovered: ribbonButtonRootStyles(theme),
    rootCheckedHovered: ribbonButtonRootStyles(theme),
    rootCheckedPressed: ribbonButtonRootStyles(theme),
    rootPressed: ribbonButtonRootStyles(theme),
    rootExpanded: ribbonButtonRootStyles(theme),
    rootExpandedHovered: ribbonButtonRootStyles(theme)
  };
};

/**
 * @private
 */
export const ribbonDividerStyle = (theme: Theme): Partial<IButtonStyles> => {
  return {
    icon: { color: theme.palette.neutralQuaternaryAlt, margin: '0 -0.5rem', height: 'auto' },
    root: { margin: '0', padding: '0', minWidth: 'auto' }
  };
};

/**
 * @private
 */
export const ribbonStyle = (): Partial<ICommandBarStyles> => {
  return {
    // Override for the default white color of the Ribbon component
    root: { backgroundColor: 'transparent' }
  };
};
