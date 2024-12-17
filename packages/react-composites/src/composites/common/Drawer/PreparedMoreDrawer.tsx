// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { useCallWithChatCompositeStrings } from '../../CallWithChatComposite/hooks/useCallWithChatCompositeStrings';
import { MoreDrawer, MoreDrawerStrings } from './MoreDrawer';
import { moreDrawerSelector } from '../../CallWithChatComposite/selectors/moreDrawerSelector';
import { useSelector } from '../../CallComposite/hooks/useSelector';
import { useHandlers } from '../../CallComposite/hooks/useHandlers';
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';
/* @condtional-compile-remove(gallery-options) */
import { VideoGalleryLayout } from '@internal/react-components';
import { ReactionResources } from '@internal/react-components';
import { DtmfDialPadOptions } from '../../CallComposite';

/** @private */
export interface PreparedMoreDrawerProps {
  onLightDismiss: () => void;
  onPeopleButtonClicked: () => void;
  callControls?: boolean | CommonCallControlOptions;
  onClickShowDialpad?: () => void;
  isCaptionsSupported?: boolean;
  disableButtonsForHoldScreen?: boolean;
  onUserSetGalleryLayout?: (layout: VideoGalleryLayout) => void;
  userSetGalleryLayout?: VideoGalleryLayout;
  onSetDialpadPage?: () => void;
  dtmfDialerPresent?: boolean;
  dtmfDialerOptions?: boolean | DtmfDialPadOptions;
  useTeamsCaptions?: boolean;
  reactionResources?: ReactionResources;
  onClickMeetingPhoneInfo?: () => void;
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
      spokenLanguageMenuTitle: strings.moreDrawerSpokenLanguageMenuTitle,
      captionLanguageMenuTitle: strings.moreDrawerCaptionLanguageMenuTitle,
      galleryOptionsMenuTitle: strings.moreDrawerGalleryOptionsMenuTitle
    }),
    [strings]
  );
  const deviceProps = useSelector(moreDrawerSelector);
  const callHandlers = useHandlers(MoreDrawer);

  return <MoreDrawer {...props} {...deviceProps} {...callHandlers} strings={moreDrawerStrings} />;
};
