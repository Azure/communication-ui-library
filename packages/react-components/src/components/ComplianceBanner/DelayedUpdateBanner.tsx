// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageBar, MessageBarType } from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { BannerMessage } from './BannerMessage';
import { _ComplianceBannerStrings } from './types';
import { ComplianceBannerVariant } from './Utils';

const BANNER_OVERWRITE_DELAY_MS = 3000;

/** @private */
export interface TimestampedVariant {
  variant: ComplianceBannerVariant;
  // Milliseconds since epoch (i.e., return value of Date.now()).
  lastUpdated: number;
}

/**
 * Shows a {@link BannerMessage} in a {@link MessageBar} tracking `variant` internally.
 *
 * This component delays and combines frequent updates to `variant` such that:
 * - Updates that happen within {@link BANNER_OVERWRITE_DELAY_MS} are delayed.
 * - Once {@link BANNER_OVERWRITE_DELAY_MS} has passed since the last update, the _latest_ pending update is shown.
 *
 * This ensures that there is enough time for the user to see a banner message before it is overwritten.
 * In case of multiple delayed messages, the user always sees the final message as it reflects the final state
 * of recording and transcription.
 *
 * @private
 */
export function DelayedUpdateBanner(props: {
  variant: TimestampedVariant;
  onDismiss: () => void;
  strings: _ComplianceBannerStrings;
}): JSX.Element {
  const { variant, lastUpdated: variantLastUpdated } = props.variant;

  // Tracks the variant that is currently visible in the UI.
  const [visible, setVisible] = useState<TimestampedVariant>({
    variant,
    lastUpdated: Date.now()
  });
  const pendingUpdateHandle = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (variant !== visible.variant && variantLastUpdated > visible.lastUpdated) {
    // Always clear pending updates.
    // We'll either update now, or schedule an update for later.
    if (pendingUpdateHandle.current) {
      clearTimeout(pendingUpdateHandle.current);
    }

    const now = Date.now();
    const timeToNextUpdate = BANNER_OVERWRITE_DELAY_MS - (now - visible.lastUpdated);
    if (variant === 'NO_STATE' || timeToNextUpdate <= 0) {
      setVisible({
        variant,
        lastUpdated: now
      });
    } else {
      pendingUpdateHandle.current = setTimeout(() => {
        // Set the actual update time, not the computed time when the update should happen.
        // The actual update might be later than we planned.
        setVisible({
          variant,
          lastUpdated: Date.now()
        });
      }, timeToNextUpdate);
    }
  }

  if (visible.variant === 'NO_STATE') {
    return <></>;
  }

  return (
    <MessageBar
      messageBarType={MessageBarType.warning}
      onDismiss={() => {
        // when closing the banner, change variant to nostate and change stopped state to off state.
        // Reason: on banner close, going back to the default state.
        setVisible({
          variant: 'NO_STATE',
          lastUpdated: Date.now()
        });
        props.onDismiss();
      }}
      dismissButtonAriaLabel={props.strings.close}
    >
      <BannerMessage variant={visible.variant} strings={props.strings} />
    </MessageBar>
  );
}
