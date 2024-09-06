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
    paddingTop: '0.5rem'
  });
};

/**
 * @private
 */
export const richTextEditorWrapperStyle = (theme: Theme): string => {
  return mergeStyles({
    paddingInlineStart: `0.75rem`,
    paddingInlineEnd: `0.75rem`,
    maxWidth: '100%',
    color: theme.palette.neutralPrimary,
    '& img': {
      margin: '0.2rem',
      maxWidth: '100% !important', // Remove !important when resolving issue where rooster sets width/height in style attribute incorrectly
      height: 'auto !important' // Remove !important when resolving issue where rooster sets width/height in style attribute incorrectly
    },
    '& table': {
      background: 'transparent',
      borderCollapse: 'collapse',
      width: '100%',
      borderSpacing: '0',
      tableLayout: 'auto',

      '& tr': {
        background: 'transparent',
        border: `1px solid ${theme.palette.neutralSecondary}`,

        '& td': {
          background: 'transparent',
          border: `1px solid ${theme.palette.neutralSecondary}`,
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
        margin: '0 0.25rem 0 0.25rem',
        width: '1.25rem',
        height: '1.25rem'
      },
      '.ribbon-table-button-filled-icon': {
        display: 'none'
      }
    }
  };
};

const ribbonButtonRootStyles = (iconColor: string, hoverIconColor: string): IStyle => {
  return {
    backgroundColor: 'transparent',
    selectors: {
      // media query applies only if the device allows real hover interactions
      // and hover styles are not applied on touch- only devices where the hover state cannot be accurately detected
      '@media (hover: hover)': {
        ':hover .ms-Button-icon': {
          color: hoverIconColor
        },
        ':hover .ms-Button-menuIcon': {
          color: hoverIconColor
        }
      },
      // the classes needs here to apply to styles for icons because of the specificity
      '.ms-Button-icon': {
        color: iconColor
      },
      '.ms-Button-menuIcon': {
        color: iconColor
      }
    }
  };
};

/**
 * @private
 */
export const toolbarButtonStyle = (theme: Theme): Partial<IButtonStyles> => {
  return {
    icon: { color: theme.palette.neutralPrimary, height: 'auto', paddingTop: '0.25rem' },
    menuIcon: { color: theme.palette.neutralPrimary, height: 'auto', paddingTop: '0.25rem' },
    root: { minWidth: 'auto', backgroundColor: 'transparent' },
    rootChecked: ribbonButtonRootStyles(theme.palette.themePrimary, theme.palette.themePrimary),
    // there is a bug for Android where the press action is considered hover sometimes
    rootHovered: ribbonButtonRootStyles(theme.palette.neutralPrimary, theme.palette.themePrimary),
    rootCheckedHovered: ribbonButtonRootStyles(theme.palette.themePrimary, theme.palette.themePrimary),
    rootCheckedPressed: ribbonButtonRootStyles(theme.palette.themePrimary, theme.palette.themePrimary),
    rootPressed: ribbonButtonRootStyles(theme.palette.themePrimary, theme.palette.themePrimary),
    rootExpanded: ribbonButtonRootStyles(theme.palette.themePrimary, theme.palette.themePrimary),
    rootExpandedHovered: ribbonButtonRootStyles(theme.palette.themePrimary, theme.palette.themePrimary)
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
        margin: '0 0.25rem 0 0.25rem',
        color: theme.palette.neutralPrimary,
        display: isSelected ? 'none' : 'inline-block'
      },
      '.ribbon-table-button-filled-icon': {
        width: '1.25rem',
        height: '1.25rem',
        margin: '0 0.25rem 0 0.25rem',
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
    paddingTop: '0.25rem'
  });
};

/**
 * @private
 */
export const richTextToolbarStyle: Partial<ICommandBarStyles> = {
  // Override for the default white color of the Ribbon component
  root: { backgroundColor: 'transparent', padding: '0.25rem 0 0 0', height: '2rem' }
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
    width: '24px',
    height: '24px',
    border: `solid 1px ${theme.palette.neutralSecondaryAlt}`,
    cursor: 'pointer',
    background: 'transparent'
  };
};

/**
 * @private
 */
export const insertTableMenuCellButtonSelectedStyles = (theme: Theme): IStyle => {
  return {
    background: theme.palette.themePrimary,
    border: `solid 1px ${theme.palette.themeLighterAlt}`
  };
};

/**
 * @private
 */
export const insertTableMenuTablePane = mergeStyles({
  padding: '8px 10px 12px 10px',
  boxSizing: 'content-box',
  minWidth: 'auto'
});

/**
 * @private
 */
export const insertTableMenuFocusZone = (theme: Theme): string => {
  return mergeStyles({
    display: 'inline-grid',
    gridTemplateColumns: 'auto auto auto auto auto',
    border: `solid 1px ${theme.palette.neutralSecondaryAlt}`
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
