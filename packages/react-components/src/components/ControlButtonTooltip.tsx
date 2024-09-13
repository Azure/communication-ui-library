// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import {
  TooltipHost,
  ITooltipHostStyles,
  ITooltipHostProps,
  ICalloutContentStyles,
  mergeStyleSets,
  useTheme
} from '@fluentui/react';
import { isDarkThemed } from '../theming/themeUtils';

// The TooltipHost root uses display: inline by default.
// To prevent sizing issues or tooltip positioning issues, we override to inline-block.
// For more details see "Icon Button with Tooltip" on https://developer.microsoft.com/en-us/fluentui#/controls/web/button
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

/**
 * Tooltip that should wrap control bar buttons.
 *
 * @private
 */
export const ControlButtonTooltip = (props: ITooltipHostProps): JSX.Element => {
  const theme = useTheme();
  const calloutStyle: Partial<ICalloutContentStyles> = {
    root: { padding: 0 },
    calloutMain: { padding: '0.5rem' },
    beakCurtain: { marginBottom: '-1rem', backgroundColor: 'transparent' }
  };

  const calloutProps = {
    gapSpace: 4,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };
  return (
    <TooltipHost
      {...props}
      data-ui-id={props.id}
      calloutProps={{ ...calloutProps, ...props.calloutProps }}
      styles={mergeStyleSets(hostStyles, props.styles)}
    >
      {props.children}
    </TooltipHost>
  );
};
