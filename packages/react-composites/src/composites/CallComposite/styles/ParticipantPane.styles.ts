// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStackStyles, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const participantPaneStyles = mergeStyles({ width: '100%', height: '100%' });

/**
 * @private
 */
export const participantPaneHiddenStyles = mergeStyles(participantPaneStyles, { display: 'none' });

/**
 * @private
 */
export const participantPaneHeaderStyles: IStackStyles = {
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '3.25rem',
    borderBottom: '0.0625rem solid #e1e1e1'
  }
};

/**
 * @private
 */
export const participantPaneBackHeaderButtonStyles: IButtonStyles = {
  root: {
    position: 'absolute',
    border: 'none',
    padding: '0'
  }
};

/**
 * @private
 */
export const participantPaneHeaderTitleStyles: IStackStyles = {
  root: {
    textAlign: 'center',
    width: '100%',
    lineHeight: '3.25rem',
    fontSize: '1.25rem',
    fontWeight: 600
  }
};
