// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IButtonStyles, ICommandBarStyles, IContextualMenuStyles, IStyle, Theme, mergeStyles } from '@fluentui/react';
import { editorTextBoxButtonStyle } from './SendBox.styles';
import { RichTextEditorStyleProps } from '../RichTextEditor/RichTextEditor';

/**
 * @private
 */
export const richTextEditorStyle = (props: { minHeight: string; maxHeight: string }): string => {
  return mergeStyles({
    border: 'none',
    overflow: 'auto',
    outline: 'none',
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    maxWidth: '100%'
  });
};

/**
 * @private
 */
export const richTextEditorWrapperStyle = (theme: Theme, addTopOffset: boolean, addRightOffset: boolean): string => {
  return mergeStyles({
    padding: `${addTopOffset ? '0.5rem' : '0'} ${addRightOffset ? '0.75rem' : '0'} 0 0.75rem`,
    lineHeight: '1.25rem',
    maxWidth: '100%',
    color: theme.palette.neutralPrimary
  });
};

/**
 * @private
 */
export const richTextActionButtonsStackStyle = mergeStyles({
  paddingRight: `0.125rem`
});

/**
 * @private
 */
export const richTextActionButtonsStyle = mergeStyles({
  height: '2.25rem',
  width: '2.25rem',
  margin: 'auto'
});

/**
 * @private
 */
export const richTextActionButtonsDividerStyle = (theme: Theme): string => {
  return mergeStyles({
    color: theme.palette.neutralQuaternaryAlt,
    margin: '0.375rem -0.5rem 0 -0.5rem',
    backgroundColor: 'transparent'
  });
};

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
export const ribbonStyle: Partial<ICommandBarStyles> = {
  // Override for the default white color of the Ribbon component
  root: { backgroundColor: 'transparent' }
};

/**
 * @private
 */
export const richTextFormatButtonIconStyle = (theme: Theme, isSelected: boolean): string => {
  return mergeStyles(editorTextBoxButtonStyle, {
    color: isSelected ? theme.palette.themePrimary : theme.palette.neutralSecondary
  });
};

/**
 * @private
 */
export const editBoxRichTextEditorStyle = (): RichTextEditorStyleProps => {
  return {
    minHeight: '2.25rem',
    maxHeight: '2.25rem'
  };
};

/**
 * @private
 */
export const sendBoxRichTextEditorStyle = (isExpanded: boolean): RichTextEditorStyleProps => {
  return {
    minHeight: isExpanded ? '5rem' : '1.25rem',
    maxHeight: '5rem'
  };
};
