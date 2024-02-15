// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IButtonStyles, Theme, mergeStyles } from '@fluentui/react';

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
export const ribbonButtonStyle = (theme: Theme): Partial<IButtonStyles> => {
  return {
    icon: { color: theme.palette.neutralSecondary },
    root: { minWidth: 'auto' },
    rootChecked: {
      backgroundColor: 'transparent',
      selectors: {
        //iconChecked is not working here because of the specificity
        '.ms-Button-icon': {
          color: theme.palette.themePrimary
        }
      }
    },
    rootHovered: {
      backgroundColor: 'transparent',
      selectors: {
        //iconChecked is not working here because of the specificity
        '.ms-Button-icon': {
          color: theme.palette.themePrimary
        }
      }
    },
    rootCheckedHovered: {
      backgroundColor: 'transparent',
      selectors: {
        //iconChecked is not working here because of the specificity
        '.ms-Button-icon': {
          color: theme.palette.themePrimary
        }
      }
    },
    rootCheckedPressed: {
      backgroundColor: 'transparent',
      selectors: {
        //iconChecked is not working here because of the specificity
        '.ms-Button-icon': {
          color: theme.palette.themePrimary
        }
      }
    },
    rootPressed: {
      backgroundColor: 'transparent',
      selectors: {
        //iconChecked is not working here because of the specificity
        '.ms-Button-icon': {
          color: theme.palette.themePrimary
        }
      }
    }
  };
};

/**
 * @private
 */
export const ribbonDividerStyle = (theme: Theme): Partial<IButtonStyles> => {
  return {
    icon: { margin: '0', color: theme.palette.neutralQuaternaryAlt },
    root: { margin: '0', padding: '0', minWidth: 'auto' }
  };
};
