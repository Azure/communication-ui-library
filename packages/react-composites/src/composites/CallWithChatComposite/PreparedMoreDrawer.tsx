// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { MoreDrawer, MoreDrawerStrings } from './components/MoreDrawer';
import { moreDrawerSelector } from './selectors/moreDrawerSelector';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { CallWithChatControlOptions } from './CallWithChatComposite';

/** @private */
export interface PreparedMoreDrawerProps {
  onLightDismiss: () => void;
  onPeopleButtonClicked: () => void;
  callControls?: boolean | CallWithChatControlOptions;
  /* @conditional-compile-remove(PSTN-calls) */
  onClickShowDialpad: () => void;
  disableButtonsForHoldScreen?: boolean;
}

/** @private */
export const PreparedMoreDrawer = (props: PreparedMoreDrawerProps): JSX.Element => {
  const strings = useCallWithChatCompositeStrings();
  const moreDrawerStrings: MoreDrawerStrings = useMemo(
    () => ({
      peopleButtonLabel: strings.peopleButtonLabel,
      audioDeviceMenuTitle: strings.moreDrawerAudioDeviceMenuTitle,
      microphoneMenuTitle: strings.moreDrawerMicrophoneMenuTitle,
      speakerMenuTitle: strings.moreDrawerSpeakerMenuTitle
    }),
    [strings]
  );
  const deviceProps = useSelector(moreDrawerSelector);
  const callHandlers = useHandlers(MoreDrawer);
  return <MoreDrawer {...props} {...deviceProps} {...callHandlers} strings={moreDrawerStrings} />;
};
