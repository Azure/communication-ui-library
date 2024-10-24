// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useMemo } from 'react';
import { SidePaneRenderer, useIsParticularSidePaneOpen } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
import { MeetingPhoneInfoPaneContent } from '../../../common/MeetingPhoneInfoPaneContent';
import { useLocale } from '../../../localization';
import { ConferencePhoneInfo } from '@internal/react-components';

const SIDE_PANE_ID = 'Meeting Phone Info';

/** @private */
export const useMeetingPhoneInfoPane = (props: {
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileView?: boolean;
  conferencePhoneInfo?: ConferencePhoneInfo[];
}): {
  openMeetingPhoneInfoPane: () => void;
  closeMeetingPhoneInfoPane: () => void;
  isMeetingPhoneInfoPaneOpen: boolean;
} => {
  const { updateSidePaneRenderer, mobileView, conferencePhoneInfo } = props;

  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
  }, [updateSidePaneRenderer]);

  const localeStrings = useLocale().component.strings.meetingConferencePhoneInfo;
  const callStrings = useLocale().strings.call;

  const onRenderHeader = useCallback(
    () => (
      <SidePaneHeader
        onClose={closePane}
        headingText={localeStrings.meetingConferencePhoneInfoModalTitle}
        dismissSidePaneButtonAriaLabel={callStrings.dismissSidePaneButtonLabel}
        mobileView={mobileView ?? false}
      />
    ),
    [mobileView, closePane, localeStrings, callStrings]
  );

  const onRenderContent = useCallback((): JSX.Element => {
    return <MeetingPhoneInfoPaneContent mobileView={mobileView} conferencePhoneInfoList={conferencePhoneInfo} />;
  }, [mobileView, conferencePhoneInfo]);

  const sidePaneRenderer: SidePaneRenderer = useMemo(
    () => ({
      headerRenderer: onRenderHeader,
      contentRenderer: onRenderContent,
      id: SIDE_PANE_ID
    }),
    [onRenderContent, onRenderHeader]
  );

  const openPane = useCallback(() => {
    updateSidePaneRenderer(sidePaneRenderer);
  }, [sidePaneRenderer, updateSidePaneRenderer]);

  const isOpen = useIsParticularSidePaneOpen(SIDE_PANE_ID);

  // Update pane renderer if it is open and the openPane dep changes
  useEffect(() => {
    if (isOpen) {
      openPane();
    }
  }, [isOpen, openPane]);

  return {
    openMeetingPhoneInfoPane: openPane,
    closeMeetingPhoneInfoPane: closePane,
    isMeetingPhoneInfoPaneOpen: isOpen
  };
};
