// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStackStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * styles for hold pane resume button
 *
 * @private
 */
export const resumeButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      borderRadius: _pxToRem(4),
      padding: `${_pxToRem(6)} ${_pxToRem(20)} `
    },
    label: {
      color: theme.palette.white,
      fontWeight: 400,
      display: 'flex',
      fontSize: _pxToRem(14)
    }
  };
};

/**
 * styles for hold pane main text
 *
 * @private
 */
export const holdPaneLabelStyles = {
  fontWeight: 600,
  fontHeight: _pxToRem(22),
  fontSize: _pxToRem(16),
  fontFamily: 'Segoe UI',
  fontStyle: 'normal',
  margin: '1rem auto 0.5rem'
};

/**
 * styles for hold pane timer
 *
 * @private
 */
export const holdPaneTimerStyles = {
  fontWeight: 600,
  fontHeight: _pxToRem(22),
  fontSize: _pxToRem(16),
  fontFamily: 'Segoe UI',
  fontStyle: 'normal',
  margin: '1rem auto 0.5rem'
};

/**
 * styles for hold pane container
 *
 * @private
 */
export const paneStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%'
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
    justifyContent: 'center'
  }
};
