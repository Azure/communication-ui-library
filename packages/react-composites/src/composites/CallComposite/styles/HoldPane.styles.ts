// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackStyles, ITextStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * styles for hold pane resume button
 *
 * @private
 */
export const resumeButtonStyles: IButtonStyles = {
  root: {
    borderRadius: _pxToRem(4),
    padding: `${_pxToRem(6)} ${_pxToRem(20)} `
  },
  label: {
    fontWeight: 400,
    display: 'flex',
    fontSize: _pxToRem(14)
  },
  labelDisabled: {
    fontWeight: 400,
    display: 'flex',
    fontSize: _pxToRem(14)
  }
};

/**
 * styles for hold pane main text
 *
 * @private
 */
export const holdPaneLabelStyles: ITextStyles = {
  root: {
    color: 'inherit',
    fontWeight: 600,
    fontHeight: _pxToRem(22),
    fontSize: _pxToRem(16),
    marginTop: '0.5rem',
    marginBottom: '1.5rem'
  }
};

/**
 * styles for hold pane timer
 *
 * @private
 */
export const holdPaneTimerStyles: ITextStyles = {
  root: {
    color: 'inherit',
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    margin: 'auto'
  }
};

/**
 * styles for hold pane container
 *
 * @private
 */
export const paneStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%',
    background: 'inherit'
  }
};

/**
 * styles for the hold pane content container
 *
 * @private
 */
export const holdPaneContentStyles: IStackStyles = {
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
};
