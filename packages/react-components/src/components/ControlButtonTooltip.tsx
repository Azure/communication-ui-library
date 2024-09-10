// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { ITooltipHostProps, ICalloutContentStyles, useTheme, Callout, Stack, DirectionalHint } from '@fluentui/react';
import { isDarkThemed } from '../theming/themeUtils';
import { useId } from '@fluentui/react-hooks';

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
    beakCurtain: { marginBottom: '-1rem', background: 'transparent' }
  };

  const calloutProps = {
    gapSpace: 4,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };

  const id = useId('controlButtonTooltip');

  const [showCallout, setShowCallout] = useState(false);
  const [showCallout2, setShowCallout2] = useState(false);

  return (
    <Stack>
      <Stack id={id} onMouseEnter={() => setShowCallout(true)} onMouseLeave={() => setShowCallout(false)}>
        {props.children}
      </Stack>
      {(showCallout || showCallout2) && (
        <Callout
          target={`#${id}`}
          {...calloutProps}
          directionalHint={DirectionalHint.topCenter}
          onMouseEnter={() => setShowCallout2(true)}
          onMouseLeave={() => setShowCallout2(false)}
        >
          {props.content}
        </Callout>
      )}
    </Stack>
  );
};
