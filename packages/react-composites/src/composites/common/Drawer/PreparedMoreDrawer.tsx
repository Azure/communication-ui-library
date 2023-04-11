// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { useCallWithChatCompositeStrings } from '../../CallWithChatComposite/hooks/useCallWithChatCompositeStrings';
import { MoreDrawer, MoreDrawerStrings } from './MoreDrawer';
import { moreDrawerSelector } from '../../CallWithChatComposite/selectors/moreDrawerSelector';
import { useSelector } from '../../CallComposite/hooks/useSelector';
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';

/** @private */
export interface PreparedMoreDrawerProps {
  onLightDismiss: () => void;
  onPeopleButtonClicked: () => void;
  callControls?: boolean | CommonCallControlOptions;
  /* @conditional-compile-remove(PSTN-calls) */
  onClickShowDialpad?: () => void;
  /* @conditional-compile-remove(close-captions) */
  isCaptionsSupported?: boolean;
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
      speakerMenuTitle: strings.moreDrawerSpeakerMenuTitle,
      captionsMenuTitle: strings.moreDrawerCaptionsMenuTitle,
      spokenLanguageMenuTitle: strings.moreDrawerSpokenLanguageMenuTitle
    }),
    [strings]
  );
  const deviceProps = useSelector(moreDrawerSelector);
  const callHandlers = useHandlers(MoreDrawer);
  return <MoreDrawer {...props} {...deviceProps} {...callHandlers} strings={moreDrawerStrings} />;
};
