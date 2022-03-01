// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStackItemStyles, IStackTokens, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const sidePaneContainerStyles: IStackItemStyles = {
  root: {
    height: '100%',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    width: '21.5rem'
  }
};

/**
 * @private
 */
export const sidePaneContainerHiddenStyles: IStackItemStyles = {
  root: {
    ...sidePaneContainerStyles,
    display: 'none'
  }
};

/**
 * @private
 */
export const sidePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const sidePaneHeaderStyles: IStackItemStyles = {
  root: {
    fontSize: '0.825rem',
    lineHeight: '1.25rem',
    padding: '0.25rem',
    fontWeight: '600'
  }
};

/**
 * @private
 */
export const paneBodyContainer: IStackStyles = { root: { flexDirection: 'column', display: 'flex' } };

/**
 * @private
 */
export const scrollableContainer: IStackStyles = { root: { flexBasis: '0', flexGrow: '1', overflowY: 'auto' } };

/**
 * @private
 */
export const scrollableContainerContents: IStackItemStyles = { root: { flexGrow: '1', flexBasis: '0' } };

/**
 * @private
 */
export const peopleSubheadingStyle: IStackItemStyles = {
  root: {
    fontSize: '0.75rem'
  }
};

/**
 * @private
 */
export const peoplePaneContainerStyle: IStackItemStyles = {
  root: {
    position: 'relative'
  }
};

/**
 * @private
 */
export const peoplePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const participantListWrapper = mergeStyles({
  width: '20rem',
  // max width at 50% of view so the People Pane is not squeezing the Message Pane to almost nothing when on small screen or high zoom in
  maxWidth: '50vw',
  height: '100%'
});

/**
 * @private
 */
export const participantListContainerPadding = { childrenGap: '0.5rem' };

/**
 * @private
 */
export const listHeader = mergeStyles({
  fontSize: '1rem',
  margin: '1rem'
});

/**
 * @private
 */
export const participantListStack = mergeStyles({
  height: '100%'
});

/**
 * @private
 */
export const participantListStyle = mergeStyles({
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden'
});
