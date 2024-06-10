// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon } from '@fluentui/react';
import React from 'react';
import LiveMessage from './Announcer/LiveMessage';

/**
 * Props for {@link MessageStatusIndicatorInternal}.
 *
 * @internal
 */
export interface MessageStatusIconProps {
  shouldAnnounce: boolean;
  iconName: string;
  iconClassName: string;
  ariaLabel?: string;
}

/**
 * Component to display message status icon
 *
 * @internal
 */
export const MessageStatusIcon = (props: MessageStatusIconProps): JSX.Element => {
  const { shouldAnnounce, iconName, iconClassName, ariaLabel } = props;

  return (
    <>
      {/* live message is used here so that aria labels are announced on mobile */}
      {ariaLabel && shouldAnnounce && <LiveMessage message={ariaLabel} ariaLive="polite" />}
      <div>
        <Icon
          role={'status'}
          // Role `status` is one of the live region roles and is used to notify screen readers of changes to the status of the message
          // it has aria-live prop set to `polite` by default.
          // By setting it to `off` value, we disable live updates when they aren't needed
          // and keep it available in the accessibility tree
          aria-live={shouldAnnounce ? 'polite' : 'off'}
          data-ui-id={'chat-composite-message-status-icon'}
          aria-label={ariaLabel}
          iconName={iconName}
          className={iconClassName}
        />
      </div>
    </>
  );
};
