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
    maxWidth: '100%',
    // this is needed to fix an issue when text has some indentation, indentation uses blockquote tag and
    // it gets both horizontal margins because of the user agent stylesheet
    // remove this code when RoosterJS content model packages are used as they use different approach for indentation
    '& blockquote': {
      marginInlineEnd: '0'
    }
  });
};

/**
 * @private
 */
export const richTextEditorWrapperStyle = (theme: Theme, addTopOffset: boolean): string => {
  return mergeStyles({
    paddingTop: `${addTopOffset ? '0.5rem' : '0'}`,
    paddingInlineStart: `0.75rem`,
    paddingInlineEnd: `0.75rem`,
    maxWidth: '100%',
    color: theme.palette.neutralPrimary,

    '& table': {
      background: 'transparent',
      borderCollapse: 'collapse',
      width: '100%',
      borderSpacing: '0',
      tableLayout: 'auto',

      '& tr': {
        background: 'transparent',
        border: `1px solid ${theme.palette.neutralLight}`,

        '& td': {
          background: 'transparent',
          border: `1px solid ${theme.palette.neutralLight}`,
          wordBreak: 'normal',
          padding: '0.125rem 0.25rem',
          verticalAlign: 'top'
        }
      }
    }
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
      },
      '.ribbon-table-button-regular-icon': {
        display: 'inline-block',
        margin: '-0.25rem 0.25rem 0 0.25rem',
        width: '1.25rem',
        height: '1.25rem'
      },
      '.ribbon-table-button-filled-icon': {
        display: 'none'
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
export const toolbarButtonStyle = (theme: Theme): Partial<IButtonStyles> => {
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

const rootRibbonTableButtonStyle = (theme: Theme): IStyle => {
  // merge IStyles props
  return Object.assign({ minWidth: 'auto' }, ribbonTableButtonRootStyles(theme, false));
};

/**
 * @private
 */
export const toolbarTableButtonStyle = (theme: Theme): Partial<IButtonStyles> => {
  return {
    icon: { height: 'auto' },
    menuIcon: { height: 'auto' },
    root: rootRibbonTableButtonStyle(theme),
    rootChecked: ribbonTableButtonRootStyles(theme, true),
    rootHovered: ribbonTableButtonRootStyles(theme, true),
    rootCheckedHovered: ribbonTableButtonRootStyles(theme, true),
    rootCheckedPressed: ribbonTableButtonRootStyles(theme, true),
    rootPressed: ribbonTableButtonRootStyles(theme, true),
    rootExpanded: ribbonTableButtonRootStyles(theme, true),
    rootExpandedHovered: ribbonTableButtonRootStyles(theme, true)
  };
};
const ribbonTableButtonRootStyles = (theme: Theme, isSelected: boolean): IStyle => {
  return {
    backgroundColor: 'transparent',
    selectors: {
      '.ribbon-table-button-regular-icon': {
        width: '1.25rem',
        height: '1.25rem',
        margin: '-0.25rem 0.25rem 0 0.25rem',
        color: theme.palette.neutralPrimary,
        display: isSelected ? 'none' : 'inline-block'
      },
      '.ribbon-table-button-filled-icon': {
        width: '1.25rem',
        height: '1.25rem',
        margin: '-0.25rem 0.25rem 0 0.25rem',
        color: theme.palette.themePrimary,
        display: isSelected ? 'inline-block' : 'none'
      }
    }
  };
};

/**
 * @private
 */
export const ribbonDividerStyle = (theme: Theme): string => {
  return mergeStyles({
    color: theme.palette.neutralQuaternaryAlt,
    margin: '0 -0.5rem',
    paddingTop: '0.5rem'
  });
};

/**
 * @private
 */
export const richTextToolbarStyle: Partial<ICommandBarStyles> = {
  // Override for the default white color of the Ribbon component
  root: { backgroundColor: 'transparent', padding: '0px' }
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
    maxHeight: '8rem'
  };
};

/**
 * @private
 */
export const sendBoxRichTextEditorStyle = (isExpanded: boolean): RichTextEditorStyleProps => {
  return {
    minHeight: isExpanded ? '4rem' : '1.25rem',
    maxHeight: '8rem'
  };
};

/**
 * @private
 */
export const insertTableMenuCellButtonStyles = (theme: Theme): IStyle => {
  return {
    width: '1rem',
    height: '1rem',
    border: `solid 0.0625rem ${theme.palette.neutralTertiaryAlt}`,
    display: 'inline-block',
    cursor: 'pointer',
    background: 'transparent',
    // include border into width value as the parent element has fixed width
    boxSizing: 'border-box'
  };
};

/**
 * @private
 */
export const insertTableMenuCellButtonSelectedStyles = (theme: Theme): IStyle => {
  return {
    background: theme.palette.themePrimary
  };
};

/**
 * @private
 */
export const insertTableMenuTablePane = mergeStyles({
  padding: '0.5rem 0.625rem 0.75rem 0.625rem',
  boxSizing: 'content-box',
  minWidth: 'auto'
});

/**
 * @private
 */
export const insertTableMenuFocusZone = (theme: Theme): string => {
  return mergeStyles({
    lineHeight: '12px',
    // fixed width is required to show columns in a grid correctly
    width: '5rem',
    border: `solid 0.0625rem ${theme.palette.neutralTertiaryAlt}`,
    // don't include border into width value as otherwise it may be broken when zoom value is changed
    boxSizing: 'content-box'
  });
};

/**
 * @private
 */
export const insertTableMenuTitleStyles = mergeStyles({
  width: '100%',
  height: '1rem',
  fontSize: '0.75rem',
  marginBottom: '0.5rem'
});

/**
 * @private
 */
export const tableContextMenuIconStyles = mergeStyles({
  marginTop: '0.375rem'
});
