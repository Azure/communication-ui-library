// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStackItemStyles, IStackTokens, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const sidePaneContainerStyles: IStackItemStyles = {
  root: {
    height: '100%',
    padding: '0.5rem 0.25rem',
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
    lineHeight: '1.25rem',
    fontWeight: '600',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem'
  }
};

/**
 * @private
 */
export const sidePaneHeaderBarStyles: IStackStyles = {
  root: {
    marginLeft: '0.5rem',
    marginRight: '0.25rem'
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
export const scrollableContainerContents: IStackItemStyles = {
  root: { flexGrow: '1', flexBasis: '0', maxWidth: '100%' }
};

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
export const participantListStack = mergeStyles({
  height: '100%'
});

/**
 * @private
 */
export const participantListStyle = mergeStyles({
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '0'
});

/**
 * @private
 */
export const participantListDesktopStyle = {
  root: {
    padding: '0'
  }
};

/**
 * @private
 */
export const participantListMobileStyle = {
  root: {
    padding: '0',
    marginLeft: '0.5rem',
    marginRight: '0.5rem'
  }
};
