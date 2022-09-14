// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, mergeStyles, IButtonProps } from '@fluentui/react';
import React from 'react';
import { buttonStyle, buttonWithIconStyles, videoCameraIconStyle } from '../styles/StartCallButton.styles';
import { Video20Filled } from '@fluentui/react-icons';
import { useLocale } from '../../localization';
/* @conditional-compile-remove(rooms) */
import { useAdapter } from '../adapter/CallAdapterProvider';

/**
 * @private
 */
export interface StartCallButtonProps extends IButtonProps {
  className?: string;
  /** If set, the button is intended to rejoin an existing call. */
  rejoinCall?: boolean;
}

/**
 * @private
 */
export const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { rejoinCall } = props;
  const locale = useLocale();
  /* @conditional-compile-remove(rooms) */
  const adapter = useAdapter();

  let startCallButtonLabel = locale.strings.call.startCallButtonLabel;
  /* @conditional-compile-remove(rooms) */
  if ('roomId' in adapter.getState()['locator']) {
    startCallButtonLabel = locale.strings.call.startRoomCallButtonLabel;
  }

  return (
    <PrimaryButton
      {...props}
      data-ui-id="call-composite-start-call-button"
      className={mergeStyles(buttonStyle, props.className)}
      styles={buttonWithIconStyles}
      text={rejoinCall ? locale.strings.call.rejoinCallButtonLabel : startCallButtonLabel}
      onRenderIcon={() => <Video20Filled className={videoCameraIconStyle} />}
    />
  );
};
