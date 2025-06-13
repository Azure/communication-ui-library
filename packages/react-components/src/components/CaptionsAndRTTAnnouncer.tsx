// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useEffect, useState } from 'react';
import { hiddenAnnouncementClassName } from './styles/Captions.style';
import { CaptionsInformation, RealTimeTextInformation } from './CaptionsBanner';

/** @internal */
export type _CaptionsAndRTTAnnouncerProps = {
  /**
   * Array of captions to be displayed
   */
  captions: CaptionsInformation[];
  /**
   * Array of finalized and partial real time text messages
   */
  realTimeTexts?: {
    completedMessages?: RealTimeTextInformation[];
    currentInProgress?: RealTimeTextInformation[];
    myInProgress?: RealTimeTextInformation;
  };
  /**
   * Title for the real time text messages
   */
  realTimeTextTitle: string;
  /**
   * Title for the captions
   */
  captionsTitle: string;
};

/** @internal */
export const _CaptionsAndRTTAnnouncer = (props: _CaptionsAndRTTAnnouncerProps): JSX.Element => {
  const { captions, realTimeTexts, realTimeTextTitle, captionsTitle } = props;
  const [announcedRTT, setAnnouncedRTT] = useState<number[]>([]);
  const [announcedCaption, setAnnouncedCaption] = useState<string[]>([]);
  const [captionAnnouncementText, setCaptionAnnouncementText] = useState<CaptionsInformation[]>([]);
  const [rttAnnouncementText, setRTTAnnouncementText] = useState<RealTimeTextInformation[]>([]);

  useEffect(() => {
    if (realTimeTexts?.completedMessages) {
      //filter out the messages that have already been announced
      const rTTMessagesToAnnounce = realTimeTexts.completedMessages.filter(
        (message) => !announcedRTT.includes(message.id)
      );
      if (rTTMessagesToAnnounce.length > 0) {
        setRTTAnnouncementText(rTTMessagesToAnnounce);
        setAnnouncedRTT((prev) => [...prev, ...rTTMessagesToAnnounce.map((message) => message.id)]);
      }
    }
    if (captions.length > 0) {
      // filter out the captions that have already been announced
      const captionsToAnnounce = captions.filter(
        (caption) => !announcedCaption.includes(caption.id) && caption.isFinalized
      );
      if (captionsToAnnounce.length > 0) {
        setCaptionAnnouncementText(captionsToAnnounce);
        setAnnouncedCaption((prev) => [...prev, ...captionsToAnnounce.map((caption) => caption.id)]);
      }
    }
  }, [captions, realTimeTexts?.completedMessages, announcedRTT, announcedCaption]);
  return (
    <>
      {(rttAnnouncementText.length > 0 || captionAnnouncementText?.length > 0) && (
        <div aria-live="assertive" role="alert" aria-atomic="true" className={hiddenAnnouncementClassName}>
          <span>
            {rttAnnouncementText.map((text) => (
              <span>
                {realTimeTextTitle} {text.displayName}: {text.message}
              </span>
            ))}
          </span>
          <span>
            {captionAnnouncementText.map((text) => (
              <span>
                {captionsTitle} {text.displayName}: {text.captionText}
              </span>
            ))}
          </span>
        </div>
      )}
    </>
  );
};
