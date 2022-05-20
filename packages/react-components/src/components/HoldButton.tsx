// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStrings } from '@azure/communication-react';
import { useTheme } from '@fluentui/react';
import React from 'react';

/* @conditional-compile-remove(PSTN-calls) */
/**
 *
 */
export interface HoldButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with communication react handlers
   * Holds the call
   */
  onHold: () => Promise<void>;
  /**
   * Utility property for using this component with communication react handlers
   * resumes the call if the local user placed it on hold
   */
  onResume: () => Promise<void>;
  /**
   * current state of the call
   */
  callState: string;
  /**
   * Optional strings to override in component
   */
  strings: HoldButtonStrings;
}

/* @conditional-compile-remove(PSTN-calls) */
/**
 * Strings for the hold button labels
 */
export interface HoldButtonStrings {
  /**
   * Label of button
   */
  label: string;
  /**
   * Content for when button is checked
   */
  tooltipOnContent: string;
  /**
   * Content for when button is unchecked
   */
  toolTipOffContent: string;
}

/* @conditional-compile-remove(PSTN-calls) */
/**
 *
 * @param props
 * @returns
 */
export const HoldButton = (props: HoldButtonProps): JSX.Element => {
  const { onHold, onResume, callState, strings } = props;

  const onToggleHold = async (state: string): Promise<void> => {
    if (state === 'localHold') {
      await onResume();
    } else {
      await onHold();
    }
  };

  return <ControlBarButton {...props} strings={strings} onClick={onToggleHold(callState)} />;
};
