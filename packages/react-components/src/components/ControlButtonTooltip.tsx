// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TooltipHost, ITooltipHostStyles, ITooltipHostProps, mergeStyleSets } from '@fluentui/react';

// Place callout with no gap between it and the button.
const calloutProps = { gapSpace: 0 };

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
