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
    // icon: { color: theme.palette.neutralSecondary, ':active': { color: 'red' } },
    // root: { ':active': { color: 'red' } },
    // rootCheckedPressed: { color: 'red' },
    // rootExpanded: {
    //   '.ms-Button-icon': {
    //     color: 'red'
    //   }
    // },
    // rootChecked: {
    //   '.ms-Button-icon': {
    //     color: 'red'
    //   }
    // },
    // rootPressed: {
    //   '.ms-Button-icon': {
    //     color: 'red'
    //   }
    // },
    // iconChecked: { color: 'red' }, //theme.palette.themePrimary }
    // iconHovered: { color: 'green' },
    // iconPressed: { color: 'red' },
    // iconDisabled: { color: 'red' },
    // iconExpanded: { color: 'red' },
    // iconExpandedHovered: { color: 'red' }
    // // rootChecked: { color: 'red' },
    // labelChecked: { color: 'red' }
    // rootPressed: { color: 'red' }
    // iconHovered: { color: theme.palette.redDark }
    // rootExpanded: {
    //   selectors: {
    //     '.ms-Button-icon': {
    //       color: 'red'
    //     },
    //     '.ms-Button-menuIcon': {
    //       color: 'red'
    //     }
    //   }
    // }
    // rootExpandedHovered: {
    //   selectors: {
    //     '.ms-Button-icon': {
    //       color: 'red'
    //     },
    //     '.ms-Button-menuIcon': {
    //       color: 'red'
    //     }
    //   }
    // },
    // rootHovered: {
    //   selectors: {
    //     '.ms-Button-icon': {
    //       color: 'red'
    //     },
    //     '.ms-Button-menuIcon': {
    //       color: 'red'
    //     }
    //   }
    // }
    // rootPressed: {
    //   selectors: {
    //     '.ms-Button-icon': {
    //       color: 'red'
    //     },
    //     '.ms-Button-menuIcon': {
    //       color: 'red'
    //     }
    //   }
    // },
    // rootChecked: {
    //   selectors: {
    //     '.ms-Button-icon': {
    //       color: 'red'
    //     },
    //     '.ms-Button-menuIcon': {
    //       color: 'red'
    //     }
    //   }
    // }
    // rootDisabled: {
    //   selectors: {
    //     '.ms-Button-icon': {
    //       color: 'red'
    //     },
    //     '.ms-Button-menuIcon': {
    //       color: 'red'
    //     }
    //   }
    // },
    // rootFocused: {
    //   selectors: {
    //     '.ms-Button-icon': {
    //       color: 'red'
    //     },
    //     '.ms-Button-menuIcon': {
    //       color: 'red'
    //     }
    //   }
    // }
  };
};

/**
 * @private
 */
export const ribbonSeparatorStyle = mergeStyles({
  margin: '0.5rem 0rem'
});
